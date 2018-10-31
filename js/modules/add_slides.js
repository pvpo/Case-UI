window.modules.add_slides = function() {

    var main_container_id = "#add_slides_modal";
    var $this = $(main_container_id);
    var activation_in_progress = false;

    $this.find('#save_slides').click(function(e) {

        var slides = [];

        $('#slides_table tbody tr').each(function() {
            slides.push({
                'name': $(this).find('.slide_name').text(),
                'description': $(this).find('.slide_description').text()
            });
        });

        $('.adding_slides').data('slides', JSON.stringify(slides));
        $('#add_slides_modal').modal('toggle');
        on_close();
        e.preventDefault();
        return false;
    });

    $this.find('#slides_table tbody').on('click', '.delete', function(e) {
        console.info('Removing Slide.')
        $(this).parent().parent().remove();
        e.preventDefault();
        return false;
    });

    $this.find('#add_slide').click(function (e) {

        var slide = {
            "name": $('#protocol_name').text(),
            "description": $('#protocol_description').val()
        };

        if (window.settings.protocol_names.indexOf(slide.name) == -1) {
            DropDownUtils.make_invalid('.protocol_names_cnt');
        } else {
            DropDownUtils.remove_invalid('.protocol_names_cnt');

            var tr = 
                "<tr>" +
                    "<td class=\"slide_name\">" + slide.name + "</td>" +
                    "<td class=\"slide_description\">" + slide.description + "</td>" +
                    "<td><a class=\"delete\" href=\"#\"><i data-feather=\"delete\"></i></a></td>" +
                "</tr>";
    
            $('#slides_table tbody').append(tr);
            feather.replace();
        }

        e.preventDefault();
        return false;
    });

    $this.find('#add_slides_modal').on('hidden.bs.modal', function() { on_close() });
    $this.find('.modal-footer .btn-secondary').click(function() { on_close() });
    $this.find('.close').click(function() { on_close()});

    var on_close = function() {
        $('#protocol_description').val('');
        $('#protocol_name').text('Protocol Name').removeClass('btn-danger').addClass('btn-secondary');
        $('.protocols-invalid-feedback').hide();
        $('.adding_slides').removeClass('adding_slides');
        $('#slides_table tbody tr').remove();
        $(document).trigger('activation_in_progress');
        location.hash = location.hash.split('/')[0];
        setTimeout(function() {
            ModuleUtils.activation_complete();
        }, 1000);
        $(document).unbind('keyup');
    }

    var escape_handler = function(e) {
        console.warn('111');
        if(e.keyCode == 27) {
            on_close();
        }
    };

    var _this = {
        get_selector: function() {  
            return main_container_id;
        },
        activate: function (case_id) {

            $(document).on('keyup', escape_handler);

            if(!activation_in_progress) {
                activation_in_progress = true;
                DropDownUtils.init(window.settings.protocol_names, '.protocol_names_cnt');
                if($('.adding_slides').data('slides')) {
                    var slides = JSON.parse($('.adding_slides').data('slides'));
            
                    for(var i in slides) {
                        var slide = slides[i];
            
                        var tr = 
                            "<tr>" +
                                "<td class=\"slide_name\">" + slide.name + "</td>" +
                                "<td class=\"slide_description\">" + slide.description + "</td>" +
                                "<td><a class=\"delete\" href=\"#\"><i data-feather=\"delete\"></i></a></td>" +
                            "</tr>";
                
                        $('#slides_table tbody').append(tr);
                        feather.replace();
                    }
                }
                
            }
            $('#add_slides_modal').modal();
            activation_in_progress = false;
            ModuleUtils.activation_complete();
        },
        clear: function( ) {
            activation_in_progress = false;
        }
    }

    return _this;
}