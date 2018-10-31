window.modules.list_cases = function() {

    var main_container_id = "#list-cases";
    var $this = $(main_container_id);
    var activation_in_progress = false;
    var table_rendered = false;

    var render_table = function(data) {
        console.log("Rendering table")
        var tbody = "";

        var display = 'style="display:none;"'

        if(window.settings.show_system_fields) {
            display = '';
        }

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
                "<td><a class=\"view_case\" href=\"#view-case/" + c.Id + "\"><i data-feather=\"eye\"></i></a></td>" +
                "<td><a class=\"delete_case\" href=\"" + c.Id + "\"><i data-feather=\"delete\"></i></a></td>" +
            "</tr>";

            $('#all_cases_table tbody').html(tbody);
            feather.replace(); 
            console.log("Table rendering done.")
        }
    }
    $this.find('#all_cases_table tbody').on('click', '.delete_case', function(e) {
        var $local_this = $(this);

        AJAXUtils.DELETE("/Case/" + $local_this.attr('href'), function() {
            var td = $local_this.parent().parent();
            td.fadeOut(function() {
                td.remove();
            });
        })

        e.preventDefault();
        return false;
    });

    $this.find('#all_cases_table tbody').on('click', '.status_case', function(e) {
        var $local_this = $(this);

        if(!$local_this.hasClass('Closed')) {
            $('main').fadeOut().promise().done(function() {
                $('#loading').fadeIn(function() {
                    $this.find('#all_cases_table tbody td').remove();
                    AJAXUtils.POST("/Case/close/" + $local_this.attr('href'), function() {
                        table_rendered = false;
                        _this.activate();
                    });
                })
            })

        }

        e.preventDefault();
        return false;
    });

    var _this = {
        get_selector: function() {  
            return main_container_id;
        },
        activate: function () {
            if(!activation_in_progress) {
                activation_in_progress = true;
                if(!table_rendered) {
                    AJAXUtils.GET("/Case", function(data) {
                        render_table(data);
                        $('#loading').fadeOut(function() {
                            $this.fadeIn();
                            table_rendered = true;
                            ModuleUtils.activation_complete();
                            activation_in_progress = false;
                        })
                    });
                } else {
                    $('#loading').fadeOut(function() {
                        $this.fadeIn();
                        ModuleUtils.activation_complete();
                        activation_in_progress = false;
                    });
                }
            }
        },
        clear: function( ) {
            activation_in_progress = false;
        }, 
        is_table_rendered: function ( ) {
            return table_rendered;
        }
    }

    return _this;
};