(function ($) {
    var app = $.sammy('#main', function () {
        this.get('#/', function () {
            //this.redirect('#/items');
            $.ajax({
                url: 'partials/home.html',
                success: function (partial) {
                    $('#main').html(partial);
                }
            })
        });

        this.get('#/items', function () {
            var items = {};
            database.getAll()
                .then(function (dbItems) {
                    items = dbItems;
                    var template = templates.get('items');
                    return template;
                })
                .then(function (template) {
                    //this is done so that you can do {{#each items}} in the template
                    var templateContext = {
                        items: items
                    };

                    $('#main').html(template(templateContext));
                });
        });

        this.get('#/items/create', function () {
            $.ajax({
                url: 'partials/create.html',
                success: function (partial) {
                    $('#main').html(partial);
                }
            });
        });

        this.get('#/items/:id', function () {
            var id = this.params.id;
            var item;
            database.getById(id)
                .then(function (dbItem) {
                    item = dbItem;
                    var template = templates.get('item');
                    return template;
                })
                .then(function (template) {
                    $('#main').html(template(item));
                });
        });

        this.post('#/items', function () {
            var params = this.params;

            var item = {
                name: params.name,
                price: params.price,
                imgSource: params.imgSrc,
                description: params.desc
            };

            database.save(item);
            this.redirect('#/items');
        })
    });

    $(function () {
        app.run('#/');
    })
}(jQuery));
