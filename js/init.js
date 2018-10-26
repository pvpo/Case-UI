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


    init_settings();
});