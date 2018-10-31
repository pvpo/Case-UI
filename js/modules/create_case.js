window.modules.create_case = function() {
    var main_container_id = "#create-case";
    var $this = $(main_container_id);
    var activation_in_progress = false;

    var initialize_drop_downs = function( ) {
        DropDownUtils.init(window.settings.case_types, '.case_type_cnt');
        DropDownUtils.init(window.settings.gender, '.gender_type_cnt');
        DropDownUtils.init(window.settings.tissue_types, '.tissue_type_cnt');
    }

    $this.find('#specimens tbody').on('click', '.delete', function(e) {
        console.info('Removing Specimen.')
        var $this = $(this).parent().parent();
        $this.fadeOut(function() {
            $this.remove();
        });
        e.preventDefault();
        return false;
    });

    $this.find('#add_specimen').click(function(e) {
        var proceed = true;

        if(!$.isNumeric($('#BlockId-Prot').val())) {
            $('#BlockId-Prot').addClass('is-invalid');
            if($('#BlockId-Prot').parent().find('.invalid-feedback').length == 0) {
                $('#BlockId-Prot').parent().append('<div class="invalid-feedback BlockId-Prot-invalid">BlockId needs to have numeric value</div>');
            }
            proceed = false;
        } else {
            $('#BlockId-Prot').removeClass('is-invalid');
            $('.BlockId-Prot-invalid').remove();
        }

        var tissue_type = $('#tissue_type').text();

        if (window.settings.tissue_types.indexOf(tissue_type) == -1) {
            DropDownUtils.make_invalid('.tissue_type_cnt');
        } else {
            DropDownUtils.remove_invalid('.tissue_type_cnt');
            $('#specimens tbody').append(
                "<tr>" +
                    "<td class=\"blockId\">" + $('#BlockId-Prot').val() + "</td>" +
                    "<td class=\"tissueType\">" + tissue_type + "</td>" +
                    "<td><a class=\"add_slide\" href=\"" + main_container_id + "/nil/#add_slides_modal\"><i data-feather=\"plus-circle\"></i></a></td>" +
                    "<td><a class=\"delete\" href=\"#\"><i data-feather=\"delete\"></i></a></td>" +
                "</tr>"
            );
            feather.replace();
            DropDownUtils.reset('.tissue_type_cnt');
            $('#BlockId-Prot').val('');
        }

        e.preventDefault();
        return false;
    });

    $this.find('#specimens').on('click', '.add_slide', function() {
        $(this).parent().parent().addClass('adding_slides');
    });

    $this.find('#save_case').click(function(e) {
        $this.fadeOut(function() {
            $('#loading').fadeIn(function() {
                $('#case_type').addClass('btn-secondary').removeClass('btn-danger');
                $('.case-type-invalid-feedback').hide();
                var case_type = $('#case_type').text();
        
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
                        
                        console.warn($(this).data('slides'))
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
                            location.hash = '#view-case/' + data.id
                        },
                        error: function (jqXHR, status) {
                            // error handler
                            console.log(jqXHR);
                            alert('fail' + status.code);
                        }
                    });
        
                }

            });
        })


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
                initialize_drop_downs();
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