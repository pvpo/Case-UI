var AJAXUtils = {
    GET: function (url, callback) {
        $.ajax({
            type: "GET",
            url: window.settings.backend_url + url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, jqXHR) {
                if(typeof callback === 'function') {
                    callback(data);
                } else {
                    console.error("Callback passed to fetch_data is not a function !")
                    alert("Callback passed to AJAXUtils.GET is not a function !");
                }
            },
            error: function (jqXHR, status) {
                console.error(jqXHR)
                alert("Error ocurred.")
            }
        });
    },
    DELETE: function(url, callback) {
        $.ajax({
            type: "DELETE",
            url: window.settings.backend_url + url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, jqXHR) {
                if(typeof callback === 'function') {
                    callback(data);
                } else {
                    console.error("Callback passed to fetch_data is not a function !")
                    alert("Callback passed to AJAXUtils.DELETE is not a function !");
                }
            },
            error: function (jqXHR, status) {
                console.error(jqXHR)
                alert("Error ocurred.")
            }
        });
    },
    POST: function(url, callback) {
        $.ajax({
            type: "POST",
            url: window.settings.backend_url + url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, jqXHR) {
                if(typeof callback === 'function') {
                    callback(data);
                } else {
                    console.error("Callback passed to fetch_data is not a function !")
                    alert("Callback passed to AJAXUtils.POST is not a function !");
                }
            },
            error: function (jqXHR, status) {
                console.error(jqXHR)
                alert("Error ocurred.")
            }
        });
    }
}