(function ($) {
    var app = $.sammy('#main', function () {
        this.get('#/', function () {
            //this.redirect('#/items');
            templates.get('home')
                .then(function (template) {
                    $('#main').html(template);
                })
                .then(function (){
                    $('#btn-search').on('click', function (ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        var value = $('#search')[0].value;
                        document.location = '#/search/' + value;
                    });
                });
            templates.get('userButton')
                .then(function (template) {
                    $('#userButton').html(template(Parse.User.current()));
                })
        });

        this.get('#/items', function () {
            var items = {};
            database.getAll()
                .then(function (dbItems) {
                    items = dbItems;
                    console.log(dbItems);
                    var template = templates.get('items');
                    return template;
                })
                .then(function (template) {
                    $('#main').html(template(items));
                })
                .then(function (){
                    $('#btn-search').on('click', function (ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        var value = $('#search')[0].value;
                        document.location = '#/search/' + value;
                    });
                });
        });

        this.get('#/items/create', function () {
            templates.get('create')
                .then(function (template) {
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
                    return item;
                })
                .then(function (item) {
                    $('#addToCart').on('click', function () {
                        utilities.addToCart(item);
                    });
                }).then(function (){
                    $('#btn-search').on('click', function (ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        var value = $('#search')[0].value;
                        document.location = '#/search/' + value;
                    });
                });
        });

        this.get('#/search/:value', function () {
            var value = this.params.value;
            //var value = $('#search')[0].value;
            //console.log(value);
            var html = {};
            database.getAll()
                .then(function (dbItems) {
                    templates.get('items')
                        .then(function (template) {
                            var editedDB = dbItems.filter(function(item){
                                if(item.name.toLowerCase().indexOf(value.toLowerCase()) >= 0){
                                    return true;
                                }
                                return false;
                            });
                            html = editedDB;
                            $('#main').html(template(html));
                        })
                        .then(function (){
                            $('#btn-search').on('click', function (ev) {
                                ev.preventDefault();
                                ev.stopPropagation();
                                var value = $('#search')[0].value;
                                document.location = '#/search/' + value;
                            });
                        });
                })
                //.then(function (template) {
                //    $('#main').html(template(html));
                //})
        });

        this.get('#/cart', function () {
            var storageItemIds = utilities.getCart()
                .then(function (storageItemIds) {
                    database.getByIds(storageItemIds)
                        .then(function (cartItems) {
                            templates.get('shopping-cart')
                                .then(function (template) {
                                    $('#main').html(template(cartItems));
                                })
                                .then(function () {
                                    $('#clear-cart').on('click',function(){
                                        utilities.clearCart();
                                    });
                                });
                        });
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

        //this.post('#/search/:value', function () {
        //    var value = this.params.value;
        //    var items = {};
        //    database.search(value)
        //        .then(function (dbItems) {
        //            items = dbItems;
        //            var template = templates.get('items');
        //            return template;
        //        })
        //        .then(function (template) {
        //            $('#main').html(template(items));
        //        });
        //});

        this.get('#/login', function (context) {
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
                        database.signUp(account)
                    });

                    $('#login-button').on('click', function (ev) {
                        accountName = $('#login-name').val();
                        accountPassword = $('#login-password').val();
                        account = {
                            name: accountName,
                            password: accountPassword
                        };
                        database.signIn(account)
                            .then(function (user) {
                                $('#log-reg-button').toggleClass('hidden');
                                $('#log-out-button').toggleClass('hidden');
                            });
                    });
                    return account;
                });
        });

        this.get('#/logout', function (context) {
            database.signOut().then(function () {
                $('#log-reg-button').toggleClass('hidden');
                $('#log-out-button').toggleClass('hidden');
            });
        });
    });

    $(function () {
        app.run('#/');
    })
}(jQuery));
