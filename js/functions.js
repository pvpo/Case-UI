/*
** Control flag for the scenario where the show method for the lis-cases
** main container is invoked multiple times.
*/
var list_cases_done = false; 

/*
** Changes the the <main> visible html element.
** Called each time when hash changes.
*/
var change_main = function(main_id) {
    console.info("Chainging main to: " + main_id)
    if(!$("[href='" + main_id + "']").hasClass('active')) {
        $('nav a').removeClass('active');
        $("[href='" + main_id + "']").addClass('active');
        $('main').hide(function() {
            if(main_id === '#list-cases') {
                if(!list_cases_done) {
                    list_cases();
                }
            } else if(main_id === '#create-report') {
                window.editor.refresh();
                list_cases_done = false;
                $(main_id).show();
            } else {
                list_cases_done = false;
                $(main_id).show();
            }
        });
    }
}

var list_cases = function() {
    list_cases_done = true;
    $('main').hide(function() {
        $('#loading').show();
    });
    
    console.info('Listing all cases.');
    if($('#all_cases_table tbody td').length === 0) {
        $.ajax({
            type: "GET",
            url: window.settings.backend_url + "/Case/",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, jqXHR) {
                var tbody = "";
                for(var i in data) {
                    var c = data[i];
                    
                    var requestorTd = "";
                    var patientTd = "";

                    if(c.Requestor) {
                        requestorTd = c.Requestor.FirstName + " " + c.Requestor.LastName;
                    }

                    if(c.Patient) {
                        patientTd = c.Patient.FirstName + " " + c.Patient.LastName;
                    }

                    tbody += 
                    "<tr>" +
                        "<td>" + c.Id + "</td>" +
                        "<td>" + requestorTd + "</td>" +
                        "<td>" + patientTd + "</td>" +
                        "<td><a class=\"view_case\" href=\"" + c.Id + "\"><i data-feather=\"eye\"></i></a></td>" +
                        "<td><a class=\"delete_case\" href=\"" + c.Id + "\"><i data-feather=\"delete\"></i></a></td>" +
                    "</tr>";
                }

                $('#all_cases_table tbody').html(tbody);
                feather.replace();
                $('main').hide(function() {
                    $('#list-cases').show();
                });
            },
            error: function (jqXHR, status) {
                // error handler
                console.log(jqXHR);
                alert('fail: ' + status.code);
            }
        }); 
    } else {
        $('main').hide(function() {
            setTimeout(function() {
                $('#list-cases').show();
            }, 1000)
        });
    }
}

var view_case = function(case_id) {
    $.ajax({
        type: "GET",
        url: window.settings.backend_url + "/Case/" + case_id,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status, jqXHR) {
            $('#view_case_id').text(data.Id)

            if(data.Patient != null) {

                $('#patient_system_id').text(data.Patient.Id);
                $('#patient_first_name').text(data.Patient.FirstName);
                $('#patient_last_name').text(data.Patient.LastName);
                $('#patient_accession_id').text(data.Patient.AccessionID);
                $('#patient_id').text(data.Patient.PatientId);
            }

            if(data.Requestor != null) {
                $('#requestor_system_id').text(data.Requestor.Id);
                $('#requestor_first_name').text(data.Requestor.FirstName);
                $('#requestor_last_name').text(data.Requestor.LastName);
                $('#requestor_email').text(data.Requestor.Email);
                $('#requestor_mobile').text(data.Patient.Mobile);
            }

            var tbody = "";
            var casesCount = 0;
            for(var i in data.Specimens) {
                var Specimen = data.Specimens[i];
                casesCount++;
                tbody +=
                "<tr>" +
                    "<td class=\"specimenId\">" + Specimen.Id + "</td>" +
                    "<td class=\"blockId\">" + Specimen.BlockId + "</td>" +
                    "<td class=\"slideId\">" + Specimen.SlideId + "</td>" +
                    "<td class=\"protocolNumber\">" + Specimen.ProtocolNumber + "</td>" +
                    "<td class=\"protocolName\">" + Specimen.ProtocolName + "</td>" +
                    "<td class=\"protocolDescription\">" + Specimen.ProtocolDescription + "</td>" +
                "</tr>";
            }

            $('#specimen_view_table tbody').html(tbody);

            location.hash = 'view-case';
        },
        error: function (jqXHR, status) {
            // error handler
            console.log(jqXHR);
            alert('fail: ' + status.code);
        }
    });
}

var init_settings = function() {
    window.settings = {
        backend_url: localStorage.getItem('be_url')
    }

    if(!window.settings.backend_url) {
        window.settings.backend_url = "https://caseservice.azurewebsites.net/api/v1"
    }

    $('#backend_api_url').val(window.settings.backend_url);

    if(location.hash != 'settings') {
        location.hash = 'settings';
    }
}