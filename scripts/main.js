(function ($) {
    var app = $.sammy('#main', function () {
        this.get('#/', function (context) {
            //this.redirect('#/items');
            $.ajax({
                url: 'partials/home.html',
                success: function (partial) {
                    $('#main').html(partial);
                }
            })
        });

        this.get('#/items', function (context) {
            var items = {};
            database.getAll()
                .then(function (dbItems) {
                    items = dbItems;
                    var template = templates.get('items');
                    return template;
                })
                .then(function (templateHTML) {
                    var template = Handlebars.compile(templateHTML);
                    //this is done so that you can do {{#each items}} in the template
                    var templateContext = {
                        items: items
                    };

                    $('#main').html(template(templateContext));
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
                .then(function (templateHTML) {
                    var template = Handlebars.compile(templateHTML);

                    $('#main').html(template(item));
                });
        })
    });
    
    $(function () {
        app.run('#/');
    })
}(jQuery))