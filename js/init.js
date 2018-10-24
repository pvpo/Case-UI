$(document).ready(function() {

    /*
    **  When hash changes, redirecting to the correct main component
    */
    $(window).on('hashchange', function(e){
        console.info("Hash Change.")
        change_main(location.hash, false)
    });

    /*
    ** Redirects to the dashboard in case when no hash exists,
    ** Redirects to the right main component in case hash is already there.
    **/
    setTimeout(function() {
        if(location.hash == '') {
            location.hash = 'dashboard';
        } else {
            change_main(location.hash, true);
        }
    }, 2000)

    /*
    **  Initialize feather iconogoraphy library.
    **/
    feather.replace()

    /*
    ** Initialize CodeMirror Web SQL editor
    **/
    window.editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: 'text/x-sql',
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets : true,
        autofocus: true,
        extraKeys: {"Ctrl-Space": "autocomplete"},
        theme: 'ambiance',
        autorefresh: true,
        hintOptions: {
            tables: {
                users: ["name", "score", "birthDate"],
                countries: ["name", "population", "size"]
            }
        }
    });

    /*
    ** Initialize the chart that is on the dashboard
    */
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            // labels: ["00 AM", "01 AM", "02 AM", "03 AM", "04 AM", "05 AM", "06 AM", "07 AM", "08 AM", "09 AM", "10 AM", "11 AM", "12 PM", "01 PM", "02 PM", "03 PM", "04 PM", "05 PM", "06 PM", "07 PM", "08 PM", "09 PM", "10 PM", "11 PM"],

            labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            datasets: [{
                data: [15339, 21345, 18483, 24003, 23489, 24092, 12034],
                lineTension: 0,
                backgroundColor: 'transparent',
                borderColor: '#007bff',
                borderWidth: 4,
                pointBackgroundColor: '#007bff'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            },
            legend: {
                display: false,
            }
        }
    });

    init_settings();
});