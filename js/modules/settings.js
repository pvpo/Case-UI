window.modules.settings = function() {

    var main_container_id = "#settings";
    var $this = $(main_container_id);
    var activation_in_progress = false;

    var refresh = function () {
        window.settings = {
            backend_url: localStorage.getItem('be_url'),
            show_system_fields: (localStorage.getItem('show_system_fields') === 'false' ? false : true),
            case_types: [],
            tissue_types: [],
            gender: [],
            protocol_names: []
        }
    
        if(!window.settings.backend_url) {
            window.settings.backend_url = "https://caseservice.azurewebsites.net/api/v1"
        }
        if(window.settings.show_system_fields) {
            $("#show_system_fields").attr('checked', true);
            $('.system').show();
        } else {
            $("#show_system_fields").attr('checked', false);
            $('.system').hide();
        }
    
        $('#backend_api_url').val(window.settings.backend_url);
    }

    refresh();


    $this.find('#save_settings').click(function(e) {
        localStorage.setItem('be_url', $('#backend_api_url').val());
        localStorage.setItem('show_system_fields', $('#show_system_fields').is(':checked'));

        refresh();

        e.preventDefault();
        return false;
    });

    AJAXUtils.GET("/Case/types", function(data) {
        window.settings.case_types = data;
        $('#case_types').val(JSON.stringify(data));
    });

    AJAXUtils.GET("/Specimen/tissue/types", function(data) {
        window.settings.tissue_types = data;
        $('#tissue_types').val(JSON.stringify(data));
    });

    AJAXUtils.GET("/Patient/gender/types", function(data) {
        window.settings.gender = data;
        $('#gender_settings').val(JSON.stringify(data));
    })

    AJAXUtils.GET("/Slide/protocols", function(data) {
        window.settings.protocol_names = data;
        $('#protocol_types').val(JSON.stringify(data));
    })


    var _this = {
        get_selector: function() {  
            return main_container_id;
        },
        activate: function (case_id) {
            if(!activation_in_progress) {
                activation_in_progress = true;
                $('#loading').fadeOut(function() {
                    $this.fadeIn(function() {
                        activation_in_progress = false;
                        ModuleUtils.activation_complete();
                    });
                });
            }
        },
        clear: function( ) {
            activation_in_progress = false;
        }
    }

    return _this;
}