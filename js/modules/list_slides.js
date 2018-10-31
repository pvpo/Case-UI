window.modules.list_slides = function() {
    var main_container_id = "#view_slides_modal";
    var $this = $(main_container_id);
    var activation_in_progress = false;

    $('#close_view_slides').click(function(e) {
        var hash_chunks = location.hash.split('/');
        var new_hash = hash_chunks[0];

        if(hash_chunks[1]) {
            new_hash += "/" + hash_chunks[1];
        }

        $(document).trigger('activation_in_progress');
        location.hash = new_hash;
        $('#view_slides_modal').modal('toggle');

        setTimeout(function() {
            ModuleUtils.activation_complete();
        }, 1000);
        e.preventDefault();
        return false;
    });

    var _this = {
        get_selector: function() {  
            return main_container_id;
        },
        activate: function (data) {
            if(!activation_in_progress) {
                activation_in_progress = true;

                var slides = JSON.parse(atob(decodeURI(data)));
                var tr = "";
                for(var i in slides) {
                    var slide = slides[i];
        
                    tr += 
                        "<tr>" +
                            "<td>" + slide.Id + "</td>" +
                            "<td>" + slide.SlideId + "</td>" +
                            "<td>" + slide.ProtocolName + "</td>" +
                            "<td>" + slide.ProtocolDescription + "</td>" +
                            "<td>" + slide.CreatedOn + "</td>" +
                        "</tr>"
        
                }
        
                $('#view_slides_table tbody').html(tr);

                $this.modal()
                activation_in_progress = false;
                ModuleUtils.activation_complete();
            }
        },
        clear: function( ) {
            activation_in_progress = false;
        }
    }

    return _this;
}