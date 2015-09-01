(function ($) {
    var app = $.sammy('#main', function () {
        this.get('#/', function (context) {
            this.redirect('#/items');
        });

        this.get('#/items', function (context) {
            database.get()
                .then(function (items) {
                    $.ajax({
                        url: 'partials/item.handlebars',
                        success: function (data) {
                            var template = Handlebars.compile(data);
                            var context = {
                                items: items
                            };
                            $('#main').html(template(context));
                        }
                    });
                })
        });
    });
    
    $(function () {
        app.run('#/');
    })
}(jQuery))