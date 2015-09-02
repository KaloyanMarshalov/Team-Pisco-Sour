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

        this.get('#/cart', function () {
            var storageItemIds = localStorage.getItem('cartItems'),
                parsedItemIds = JSON.parse(storageItemIds);

            database.getByIds(parsedItemIds)
                .then(function (cartItems) {
                    templates.get('shopping-cart')
                        .then(function (template) {

                            $('#main').html(template(cartItems));
                        })
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
        });

        this.get('#/login', function () {
            var accountName,
                accountPassword,
                account;
            templates.get('login')
                .then(function (template) {
                    $('#main').html(template);
                    $('#register-button').on('click', function (ev) {
                        accountName = $('#login-name').val();
                        accountPassword = $('#login-password').val();
                        account = {
                            name: accountName,
                            password: accountPassword
                        };
                        console.log(account);
                        database.signUp(account)
                            .then(function(account){
                                database.signIn(account);
                            });
                    });

                    $('#login-button').on('click', function (ev) {
                        accountName = $('#login-name').val();
                        accountPassword = $('#login-password').val();
                        account = {
                            name: accountName,
                            password: accountPassword
                        };
                        database.signIn(account);
                    });

                    return account;
                });
        });
    });

    $(function () {
        app.run('#/');
    })
}(jQuery));
