window.modules.view_case = function() {

    var main_container_id = "#view-case";
    var $this = $(main_container_id);
    var activation_in_progress = false;

    var populate = function(data) {
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

            var viewSlides = "<td><i data-feather=\"eye\"></i></td>";
            if(Specimen.Slides && Specimen.Slides.length != 0) {
                var slideData = btoa(JSON.stringify(Specimen.Slides));
                viewSlides =  "<td><a class=\"view_slides\" href=\"#\" data-slides=\"" + slideData + "\"><i data-feather=\"eye\"></i></a></td>";
            }

            casesCount++;
            tbody +=
                "<tr>" +
                    "<td " + display + " class=\"specimenSystemId system\">" + Specimen.Id + "</td>" +
                    "<td class=\"specimenId\">" + Specimen.SpecimenId + "</td>" +
                    "<td class=\"blockId\">" + Specimen.BlockId + "</td>" +
                    "<td class=\"tissueType\">" + Specimen.TissueType + "</td>" +
                    "<td class=\"createdOn\">" + Specimen.CreatedOn + "</td>" +
                    viewSlides +
                "</tr>";
        }

        $('#specimen_view_table tbody').html(tbody);
        feather.replace();
    }

    $this.find('#specimen_view_table tbody').on('click', '.view_slides', function(e) {
        location.hash += '/#view_slides_modal/' + encodeURI($(this).data('slides'));
        e.preventDefault();
        return false;
    });
    

    var _this = {
        get_selector: function() {  
            return main_container_id;
        },
        activate: function (case_id) {
            if(!activation_in_progress) {
                activation_in_progress = true;
                AJAXUtils.GET("/Case/" + case_id, function(data) {
                    populate(data);
                    $('#loading').fadeOut(function() {
                        $this.fadeIn(function() {
                            activation_in_progress = false;
                            ModuleUtils.activation_complete();
                        }) 
                    });
                })
            }
        },
        clear: function( ) {
            activation_in_progress = false;
        }
    }

    return _this;
}