var DropDownUtils = {
    init: function (data, selector, callback) {
        var $this = $(selector);
        if(!$this.hasClass('initialized')) {
            var entry_list = "";
            for(var i in data) {
                var entry = data[i];
                entry_list += '<a class="dropdown-item" href="#">' + entry + '</a>';
            }

            $this.addClass("initialized");
            $this.find('.dropdown-menu').html(entry_list);

            if(typeof callback === 'function') {
                callback($this);
            }

            $this.on('click', '.dropdown-item', function(e) {
                $this.find("button").text($(this).text()).click();
                e.preventDefault();
                return false;
            });
        }
    },
    make_invalid: function(selector) {
        var $this = $(selector);
        $this.find('button').removeClass('btn-secondary').addClass('btn-danger').text($this.data('default'));
        $this.find('.invalid-feedback').fadeIn();
    },
    remove_invalid: function(selector) {
        var $this = $(selector);
        $this.find('button').removeClass('btn-danger').addClass('btn-secondary');
        $this.find('.invalid-feedback').fadeOut();
    },
    reset: function(selector) {
        var $this = $(selector);
        DropDownUtils.remove_invalid();
        $this.find('button').text($this.data('default'));
    }

}