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

        if(!$.isNumeric($('#SlideId-Prot').val())) {
            $('#SlideId-Prot').addClass('is-invalid');
            $('#SlideId-Prot').parent().append('<div class="invalid-feedback">SlideId needs to have numeric value</div>');
            proceed = false;
        }

        if(proceed) {
            $('#specimens tbody').append(
                "<tr>" +
                    "<td class=\"specimenId\">" + $('#SpecimenId-Prot').val() + "</td>" +
                    "<td class=\"blockId\">" + $('#BlockId-Prot').val() + "</td>" +
                    "<td class=\"slideId\">" + $('#SlideId-Prot').val() + "</td>" +
                    "<td class=\"protocolNumber\">" + $('#ProtocolNumber-Prot').val() + "</td>" +
                    "<td class=\"protocolName\">" + $('#ProtocolName-Prot').val() + "</td>" +
                    "<td class=\"protocolDescription\">" + $('#ProtocolDescription-Prot').val() + "</td>" +
                    "<td><a class=\"delete\" href=\"#\"><i data-feather=\"delete\"></i></a></td>" +
                "</tr>"
            );
            feather.replace();
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

        var patient = {
            'accessionID': $('#AccessionID').val(),
            'firstName': $('#PatientFirstName-Prot').val(),
            'lastName': $('#PatientLastName-Prot').val(),
            'patientId': $('#PatientLastName-Prot').val()
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
            })
            specimens.push(specimen);
        });

        $.ajax({
            type: "POST",
            url: window.settings.backend_url + "/Case",
            data: JSON.stringify({
                'patient': patient,
                'requestor': requestor,
                'specimens': specimens
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, jqXHR) {
                $('#create-case input').val('');
                $('#specimen_table tbody tr').remove();
                view_case(data.id)
            },
            error: function (jqXHR, status) {
                // error handler
                console.log(jqXHR);
                alert('fail' + status.code);
            }
        });

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

    $('#save_settings').click(function(e) {
        console.warn(111111111);
        location.hash = 'loading';
        localStorage.setItem('be_url', $('#backend_api_url').val());

        init_settings();

        e.preventDefault();
        return false;
    });
});