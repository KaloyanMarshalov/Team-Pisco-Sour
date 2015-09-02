(function ($) {
    var app = $.sammy('#main', function () {
        this.get('#/', function () {
            //this.redirect('#/items');
            templates.get('home')
                .then(function(template){
                    $('#main').html(template);
                });
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
            templates.get('create')
                .then(function(template){
                    $('#main').html(template);
                });
            $('#submit-button').on('click', function () {
                //var name = $('#inputName').val(),
                //    price = $('#inputName').val(),
                //
                console.log('hi');

            })
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
    });
    
    $(function () {
        app.run('#/');
    })
}(jQuery));
