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
                    $('#main').html(template(items));
                });
        });

        this.get('#/items/create', function () {
            $.ajax({
                url: 'partials/create.html',
                success: function (partial) {
                    $('#main').html(partial);
                }
            });
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
        this.get('#/login', function(){
            templates.get('login')
                .then(function(template){
                    $('#main').html(template);
                });
        });
    });

    $(function () {
        app.run('#/');
    })
}(jQuery));
