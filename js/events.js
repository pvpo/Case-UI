$(document).ready(function() {
    $('#add_specimen').click(function(e){

        var proceed = true;

        if(!$.isNumeric($('#BlockId-Prot').val())) {
            $('#BlockId-Prot').addClass('is-invalid');
            $('#BlockId-Prot').parent().append('<div class="invalid-feedback">BlockId needs to have numeric value</div>');
            proceed = false;
        }

        if(!$.isNumeric($('#ProtocolNumber-Prot').val())) {
            $('#ProtocolNumber-Prot').addClass('is-invalid');
            $('#ProtocolNumber-Prot').parent().append('<div class="invalid-feedback">ProtocolNumber needs to have numeric value</div>');
            proceed = false;
        }

        $('#tissue_type').removeClass('btn-danger').addClass('btn-secondary');
        $('.tissue-type-invalid-feedback').hide();
        var tissue_type = $('#tissue_type').text();

        console.warn(tissue_type);

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
                        "<td class=\"protocolNumber\">" + $('#ProtocolNumber-Prot').val() + "</td>" +
                        "<td class=\"protocolName\">" + $('#ProtocolName-Prot').val() + "</td>" +
                        "<td class=\"protocolDescription\">" + $('#ProtocolDescription-Prot').val() + "</td>" +
                        "<td class=\"tissueType\">" + tissue_type + "</td>" +
                        "<td><a class=\"delete\" href=\"#\"><i data-feather=\"delete\"></i></a></td>" +
                    "</tr>"
                );
                feather.replace();
            }
        }            

        e.preventDefault();
        return false;
    });

    $('#specimens tbody').on('click', '.delete', function(e) {
        console.info('Removing Specimen.')
        $(this).parent().parent().remove();
        e.preventDefault();
        return false;
    });

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
                $(this).find('td').each(function() {
                    if($(this).attr('class') != undefined) {
                        specimen[$(this).attr('class')] = $(this).text();
                    }
                });
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


});