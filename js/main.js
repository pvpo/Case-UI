$(document).ready(function() {

    ModuleUtils.init_all();
    var activation_in_progress = false;
    var current_hash = '';

    if(!activation_in_progress) {
        activation_in_progress = true;
        var chunks = location.hash.split('/');
        if(chunks[2]) {
            location.hash = chunks[0] + '/' + chunks[1]
            current_hash = location.hash;
        }

        $("[href='" + chunks[0] + "']").addClass('active');
        ModuleUtils.activate_module(chunks[0], chunks[1]);
    }

    $(document).on("activation_complete", function() {
        console.info("Module activation completed")
        activation_in_progress = false;

        if ($(window).width() < 600 ) {
            var cnt_height = ($('.container-fluid').height() - $('.navbar').height()) - 100;
            $('.container-fluid').css('height', cnt_height + 'px');
        }
        feather.replace()
    });

    $(document).on("activation_in_progress", function() {
        activation_in_progress = true;
    });
    
    $(window).on('hashchange', function(e) {
        console.log("HashChanged !")

        if(location.hash == "#menu") {
            activation_in_progress = true;
            location.hash = current_hash;
            activation_in_progress = false;
        } else {

            if(!activation_in_progress) {
                var hash_chunks = location.hash.split("/");
                var selector = hash_chunks[0]
                activation_in_progress = true;
                if(hash_chunks[2]) {
                    console.log("Activating sub-module")
                    ModuleUtils.activate_sub_module(hash_chunks[2], hash_chunks[3]);
                } else {
                    ModuleUtils.activate_module(selector, hash_chunks[1]);
                    $('.active').removeClass('active');
                    $("[href='" + selector + "']").addClass('active');
    
                }
                current_hash = location.hash;
            } else {
                console.log("Activation was in progress")
                location.hash = current_hash;
                //TODO what happens when module activization is in progres and somebody clicks
                // location.hash = '#' + $('main:visible').attr('id');
            } 
        }


    });

});
