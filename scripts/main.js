(function ($) {
    var app = $.sammy('#main', function () {
        this.get('#/', function (context) {
            this.load('data/data.json')
                .then(function (items) {
                    $.ajax({
                        url: 'partials/item.handlebars',
                        success: function (data) {
                            var template = Handlebars.compile(data);
                            $('#main').html(template(items));
                        }
                    });
                    console.log(items);
                })
        })
    });
    
    $(function () {
        app.run('#/');
    })
}(jQuery))