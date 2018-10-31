window.modules = {};

var ModuleUtils = {
    clear_all: function() {
        for(var i in window.modules) {
            var module = window.modules[i];
            console.info("Clearing moudle: " + i);
            module.clear();
        }
    },
    find_module_by_selector: function(selector) {
        for(var i in window.modules) {
            var module = window.modules[i];
            var module_selector = module.get_selector();
            if(module_selector === selector) {
                return module;
            }
        }

        return null;
    },
    activate_sub_module: function(module_selector, param) {
        var module = ModuleUtils.find_module_by_selector(module_selector);
        if(module) {
            module.activate(param);
        } else {
            console.log("Module not found falling back to #dashboard");
            ModuleUtils.activation_complete();
            location.hash = '#dashboard';
        }

    },
    activate_module: function (module_selector, param) {
        console.log("Activation of module: " + module_selector + " requested.");
        var module = ModuleUtils.find_module_by_selector(module_selector);
        
        if(module) {
            $('main').fadeOut().promise().done(function() {
                $('#loading').fadeIn(function() {
                    console.log("Activating module ", module);
                    if(!param) {
                        module.activate();
                    } else {
                        console.log("Module parameter found: " + param);
                        module.activate(param);
                    }

                    ModuleUtils.clear_all();
                })
            });
        } else {
            console.log("Module not found falling back to #dashboard");
            ModuleUtils.activation_complete();
            location.hash = '#dashboard';
        }
    },
    init_all: function() {
        for(var i in window.modules) {
            var module = window.modules[i];

            window.modules[i] = module();
        }
    },
    activation_complete: function () {
        $(document).trigger("activation_complete");
    }
}