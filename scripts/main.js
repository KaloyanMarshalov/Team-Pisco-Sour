(function ($) {
    var app = $.sammy('#main', function () {
        this.get('#/', function (context) {
            this.redirect('#/items');
        });

        this.get('#/items', function (context) {
            database.getAll()
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
        
        this.get('#/items:id', function () {
            var id = this.params.id;
            var item;
            database.getById(id)
                .then(function (res) {
                    //TODO: finish the getByID
                });
        })
    });
    
    $(function () {
        app.run('#/');
    })
}(jQuery))