$(document).ready(function() {
    $('#add_specimen').click(function(e){

        var proceed = true;

        if(!$.isNumeric($('#BlockId-Prot').val())) {
            $('#BlockId-Prot').addClass('is-invalid');
            $('#BlockId-Prot').parent().append('<div class="invalid-feedback">BlockId needs to have numeric value</div>');
            proceed = false;
        }

        $('#tissue_type').removeClass('btn-danger').addClass('btn-secondary');
        $('.tissue-type-invalid-feedback').hide();
        var tissue_type = $('#tissue_type').text();

        if (window.settings.tissue_types.indexOf(tissue_type) == -1) {
            $('#tissue_type').removeClass('btn-secondary').addClass('btn-danger');
            $('.tissue-type-invalid-feedback').show();
            location.hash = 'create-case';
            $('#tissue_type').text('Tissue Type');
        } else {
            if(proceed) {
                $('#specimens tbody').append(
                    "<tr>" +
                        "<td class=\"blockId\">" + $('#BlockId-Prot').val() + "</td>" +
                        "<td class=\"tissueType\">" + tissue_type + "</td>" +
                        "<td><a class=\"add_slide\" href=\"#\"><i data-feather=\"plus-circle\"></i></a></td>" +
                        "<td><a class=\"delete\" href=\"#\"><i data-feather=\"delete\"></i></a></td>" +
                    "</tr>"
                );
                feather.replace();
            }
        }            

        e.preventDefault();
        return false;
    });
    
    $('#slides_table tbody').on('click', '.delete', function(e) {
        console.info('Removing Slide.')
        $(this).parent().parent().remove();
        e.preventDefault();
        return false;
    });

    $('#specimens tbody').on('click', '.delete', function(e) {
        console.info('Removing Specimen.')
        $(this).parent().parent().remove();
        e.preventDefault();
        return false;
    });

    $('#specimens tbody').on('click', '.add_slide', function(e) {

        $(this).parent().parent().addClass('adding_slides');


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

        $('#add_slides_modal').modal();

        e.preventDefault();
        return false;
    })

    $('#add_slides_modal').on('hidden.bs.modal', function () {
        $('#protocol_description').val('');
        $('#protocol_name').text('Protocol Name').removeClass('btn-danger').addClass('btn-secondary');
        $('.protocols-invalid-feedback').hide();
        $('.adding_slides').removeClass('adding_slides');
        $('#slides_table tbody tr').remove();
    })

    $('#save_case').click(function(e) {
        location.hash = 'loading';

        $('#case_type').addClass('btn-secondary').removeClass('btn-danger');
        $('.case-type-invalid-feedback').hide();
        var case_type = $('#case_type').text();

        console.warn(case_type);

        if (window.settings.case_types.indexOf(case_type) == -1) {
            $('#case_type').removeClass('btn-secondary').addClass('btn-danger');
            $('.case-type-invalid-feedback').show();
            location.hash = 'create-case';
            $('#case_type').text('Case Type');
        } else {


            var patient = {
                'firstName': $('#PatientFirstName-Prot').val(),
                'lastName': $('#PatientLastName-Prot').val(),
                'gender': $('#gender').text()
            }
    
            var requestor = {
                'firstName': $('#RequestorFirstName-Prot').val(),
                'lastName': $('#RequestorLastName-Prot').val(),
                'email': $('#Email').val(),
                'mobile': $('#Mobile').val()
            }
    
            var specimens = [];
    
            $('#specimen_table tbody tr').each(function(){
                var specimen = {};
                specimen['BlockId'] = $(this).find('.blockId').text();
                specimen['TissueType'] = $(this).find('.tissueType').text();
                
                
                // $(this).find('td').each(function() {
                    // if($(this).attr('class') != undefined) {
                    //     specimen[$(this).attr('class')] = $(this).text();
                    // }
                // });
                if($(this).data('slides')) {
                    var slide_data = JSON.parse($(this).data('slides'));
                    specimen['Slides'] = [];
                    for(var i in slide_data) {
                        var slide = slide_data[i]
                        specimen['Slides'].push({
                            "ProtocolName": slide.name,
                            "ProtocolDescription": slide.description
                        })
                    }
                }

                console.warn(specimen);
                specimens.push(specimen);
            });
    
            $.ajax({
                type: "POST",
                url: window.settings.backend_url + "/Case",
                data: JSON.stringify({
                    'type': case_type,
                    'patient': patient,
                    'requestor': requestor,
                    'specimens': specimens
                }),
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data, status, jqXHR) {
                    $('#create-case input').val('');
                    $('#specimen_table tbody tr').remove();
                    $('#case_type').text('Case Type');
                    $('#gender').text('Gender');
                    $('#tissue_type').text('Tissue Type');
                    view_case(data.id)
                },
                error: function (jqXHR, status) {
                    // error handler
                    console.log(jqXHR);
                    alert('fail' + status.code);
                }
            });

        }


        e.preventDefault();
        return false;
    });

    $('#all_cases_table tbody').on('click', '.view_case', function(e) {
        location.hash = 'loading';
        view_case($(this).attr('href'));
        e.preventDefault();
        return false;
    })

    $('#all_cases_table tbody').on('click', '.delete_case', function(e) {
        var $this = $(this);
        $.ajax({
            type: "DELETE",
            url: window.settings.backend_url + "/Case/" + $(this).attr('href'),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, jqXHR) {
                var td = $this.parent().parent();
                td.fadeOut(function() {
                    td.remove();
                });
            },
            error: function (jqXHR, status) {
                // error handler
                console.log(jqXHR);
                alert('fail: ' + status.code);
            }
        });

        e.preventDefault();
        return false;
    });

    $('#specimen_view_table tbody').on('click', '.view_slides', function(e) {

        var slides = JSON.parse(atob($(this).data('slides')));

        for(var i in slides) {
            var slide = slides[i];

            var tr = 
                "<tr>" +
                    "<td>" + slide.Id + "</td>" +
                    "<td>" + slide.SlideId + "</td>" +
                    "<td>" + slide.ProtocolName + "</td>" +
                    "<td>" + slide.ProtocolDescription + "</td>" +
                    "<td>" + slide.CreatedOn + "</td>" +
                "</tr>"

        }

        $('#view_slides_table tbody').html(tr);
        $('#view_slides_modal').modal();
        e.preventDefault();
        return false;
    });

    $('#close_view_slides').click(function(e) {
        $('#view_slides_modal').modal('toggle')
        e.preventDefault();
        return false;
    });

    $('#all_cases_table tbody').on('click', '.status_case', function(e) {
        var $this = $(this);

        if(!$this.hasClass('Closed')) {
            location.hash = 'loading';
            $('#all_cases_table tbody td').remove();
            $.ajax({
                type: "POST",
                url: window.settings.backend_url + "/Case/close/" + $(this).attr('href'),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data, status, jqXHR) {
                    list_cases();
                },
                error: function (jqXHR, status) {
                    // error handler
                    console.log(jqXHR);
                    alert('fail: ' + status.code);
                }
            });
        }

        e.preventDefault();
        return false;
    });

    $('#save_settings').click(function(e) {
        localStorage.setItem('be_url', $('#backend_api_url').val());
        localStorage.setItem('show_system_fields', $('#show_system_fields').is(':checked'));

        init_settings();

        e.preventDefault();
        return false;
    });

    $('#add_slide').click(function (e) {

        var slide = {
            "name": $('#protocol_name').text(),
            "description": $('#protocol_description').val()
        };

        if (window.settings.protocol_names.indexOf(slide.name) == -1) {
            $('#protocol_name').removeClass('btn-secondary').addClass('btn-danger');
            $('.protocols-invalid-feedback').show();
        } else {
            $('#protocol_name').removeClass('btn-danger').addClass('btn-secondary');
            $('.protocols-invalid-feedback').hide();
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

    $('#save_slides').click(function(e) {

        var slides = [];

        $('#slides_table tbody tr').each(function() {
            slides.push({
                'name': $(this).find('.slide_name').text(),
                'description': $(this).find('.slide_description').text()
            });
        });

        $('.adding_slides').data('slides', JSON.stringify(slides));
        $('#add_slides_modal').modal('toggle');

        e.preventDefault();
        return false;
    });

    $('.case_type_cnt').on('click', '.dropdown-item', function(e) {
        $('#case_type').text($(this).text()).click();
        e.preventDefault();
        return false;
    });

    $('.tissue_type_cnt').on('click', '.dropdown-item', function(e) {
        $('#tissue_type').text($(this).text()).click();
        e.preventDefault();
        return false;
    });

    $('.gender_type_cnt').on('click', '.dropdown-item', function(e) {
        $('#gender').text($(this).text()).click();
        e.preventDefault();
        return false;
    });


    $('.protocol_names_cnt').on('click', '.dropdown-item', function(e) {
        $('#protocol_name').text($(this).text()).click();

        console.warn('wtf?s')
        e.preventDefault();
        return false;
    });


});