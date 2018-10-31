window.modules.dashboard = function() {

    var main_container_id = "#dashboard";
    var $this = $(main_container_id);
    var activation_in_progress = false;
    var charts_rendered = 0;
    var chart_render_interval = null;
    
    var fetch_daily_closed_cases_data = function(callback) {
        AJAXUtils.GET("/Stats/cases/closed/daily", callback);
    }

    var fetch_db_stats_data = function(callback) {
        AJAXUtils.GET("/Stats/db/stats", callback);
    }

    var render_closed_cases_daily_chart = function() {
        fetch_daily_closed_cases_data(function(data) {
            ChartUtils.create_line_chart('container', 'Cases Closed Today', 'Case count', 'Closed Cases', data);
            charts_rendered++;
        });
    }

    var render_db_stats_chart = function() {
        fetch_db_stats_data(function(data) {
            var parsed_data = [];

            for(var i in data) {
                var dat = data[i];
    
                parsed_data.push([dat[0], parseInt(dat[1])]);
            }
            ChartUtils.create_bar_chart('container1', 'DB Entries count', 'Entries', 'DB Entries count', parsed_data);
            charts_rendered++;
        });
    }

    var _this = {
        get_selector: function() {  
            return main_container_id;
        },
        activate: function () {
            if(!activation_in_progress) {
                activation_in_progress = true;
                if(charts_rendered != 2) {
                    render_closed_cases_daily_chart();
                    render_db_stats_chart();
                    chart_render_interval = setInterval(function(){
                        console.log("Waiting all charts to be properly rendered.");
                        if(charts_rendered == 2) {
                            console.log("All charts are rendered properly.")
                            clearInterval(chart_render_interval);
                            $('#loading').fadeOut(function() {
                                $this.fadeIn(function() {
                                    ModuleUtils.activation_complete();
                                    activation_in_progress = false;
                                });
                            });
                        }
                    }, 1000);
                } else {
                    $('#loading').fadeOut(function() {
                        $this.fadeIn(function() {
                            ModuleUtils.activation_complete();
                            activation_in_progress = false;
                        });
                    });
                }
            }
        },
        clear: function( ) {
            activation_in_progress = false;
            // clearInterval(chart_render_interval);
        }
    }

    return _this;
}