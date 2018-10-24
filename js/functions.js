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

        var display = 'style="display:none;"'

        if(window.settings.show_system_fields) {
            display = '';
        }

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

                    var statusIcon = "circle";

                    if(c.Status === 'Closed') {
                        statusIcon = 'x-circle';
                    }

                    tbody += 
                    "<tr>" +
                        "<td  " + display + "  class=\"system\">" + c.Id + "</td>" +
                        "<td>" + c.CaseId + "</td>" +
                        "<td>" + requestorTd + "</td>" +
                        "<td>" + patientTd + "</td>" +
                        "<td>" + c.Type + "</td>" +
                        "<td>" + c.CreatedOn + "</td>" +
                        "<td>" + c.OpenTime + "</td>" +
                        "<td><a class=\"status_case " + c.Status + "\" href=\"" + c.Id + "\"><i data-feather=" + statusIcon + "></i></a></td>" +
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
            $('#view_case_id').text(data.CaseId);
            $('#view_case_system_id').text(data.Id);
            $('#view_case_type').text(data.Type);
            $('#view_case_createdon').text(data.CreatedOn);
            $('#view_case_open_time').text(data.OpenTime);

            if(data.Patient != null) {
                $('#patient_system_id').text(data.Patient.Id);
                $('#patient_first_name').text(data.Patient.FirstName);
                $('#patient_last_name').text(data.Patient.LastName);
                $('#patient_id').text(data.Patient.PatientId);
                $('#patient_gender_view').text(data.Patient.Gender);
                $('#patient_createdon').text(data.Patient.CreatedOn);
            
            }

            if(data.Requestor != null) {
                $('#requestor_system_id').text(data.Requestor.Id);
                $('#requestor_first_name').text(data.Requestor.FirstName);
                $('#requestor_last_name').text(data.Requestor.LastName);
                $('#requestor_email').text(data.Requestor.Email);
                $('#requestor_mobile').text(data.Patient.Mobile);
                $('#requestor_createdon').text(data.Patient.CreatedOn);

            }

            var tbody = "";
            var casesCount = 0;
            var display = 'style="display:none;"'

            if(window.settings.show_system_fields) {
                display = '';
            }

            for(var i in data.Specimens) {
                var Specimen = data.Specimens[i];
                casesCount++;
                tbody +=
                "<tr>" +
                    "<td " + display + " class=\"specimenSystemId system\">" + Specimen.Id + "</td>" +
                    "<td class=\"specimenId\">" + Specimen.SpecimenId + "</td>" +
                    "<td class=\"blockId\">" + Specimen.BlockId + "</td>" +
                    "<td class=\"protocolNumber\">" + Specimen.ProtocolNumber + "</td>" +
                    "<td class=\"protocolName\">" + Specimen.ProtocolName + "</td>" +
                    "<td class=\"protocolDescription\">" + Specimen.ProtocolDescription + "</td>" +
                    "<td class=\"tissueType\">" + Specimen.TissueType + "</td>" +
                    "<td class=\"createdOn\">" + Specimen.CreatedOn + "</td>" +
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
        backend_url: localStorage.getItem('be_url'),
        show_system_fields: (localStorage.getItem('show_system_fields') === 'false' ? false : true),
        case_types: [],
        tissue_types: [],
        gender: []
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

    $.get(window.settings.backend_url + "/Case/types", function(data){
        window.settings.case_types = data;
        $('#case_types').val(JSON.stringify(data));

        var case_type_list = "";
        for(var i in data) {
            var ct = data[i];
            case_type_list += '<a class="dropdown-item" href="#">' + ct + '</a>'
        }

        $('.case_type_list').html(case_type_list);
    });

    $.get(window.settings.backend_url + "/Specimen/tissue/types", function(data){
        window.settings.tissue_types = data;
        $('#tissue_types').val(JSON.stringify(data));

        var tissue_type_list = "";
        for(var i in data) {
            var ct = data[i];
            tissue_type_list += '<a class="dropdown-item" href="#">' + ct + '</a>'
        }

        $('.tissue_type_list').html(tissue_type_list);
    });

    $.get(window.settings.backend_url + "/Patient/gender/types", function(data){
        window.settings.gender = data;
        $('#gender_settings').val(JSON.stringify(data));

        var gender_type_list = "";
        for(var i in data) {
            var ct = data[i];
            gender_type_list += '<a class="dropdown-item" href="#">' + ct + '</a>'
        }

        $('.gender').html(gender_type_list);
    });

    $('#backend_api_url').val(window.settings.backend_url);

}