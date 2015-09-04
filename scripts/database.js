var database = (function () {
    Parse.initialize("ScOtySOfPiKIxOuM7WU5Huyx6whJFQAP1mNZjx2T", "qtR9xS9VmWmdu1aAlsYMrGXlVMM0Q38DyYCRZNNr");
    //Parse.initialize("JkXEn9Qw4YUF5jfxhtBRtAPlnrbsgHfoSQajlJ5T", "bNmQ0X1xCSMkpfRq0JxCCYWLctPCpljxgMkhlu69");

    var Item = Parse.Object.extend('Item');

    function _mapItems (items) {
        var mappedItems = items.map(function (item) {
            var returnItem = {};
            returnItem.id = item.id;
            returnItem.name = item.get('name');
            returnItem.price = item.get('price');
            returnItem.imgSource = item.get('imgSource');
            returnItem.description = item.get('description');

            return returnItem;
        });

        return mappedItems;
    }

    function getAll() {
        var promise = new Promise(function (resolve, reject) {
            var query = new Parse.Query(Item);

            query.find({
                success: function (items) {
                    var mappedItems = _mapItems(items)
                    resolve(mappedItems);
                },
                error: function (error) {
                    console.log(error.code + ' ' + error.message);
                }
            });
        });

        return promise;
    }

    function search(value) {
        var promise = new Promise(function (resolve, reject) {
            var query = new Parse.Query(Item);
            query.contains('name', value);
            query.find({
                //.then(function (items) {
                //    return _mapItems(items);
                //
                //})
                //.then(function(data){
                //    resolve(data);
                //})
                success: function (items) {
                    var mappedItems = _mapItems(items)
                    resolve(mappedItems);
                },
                error: function (error) {
                    console.log(error.code + ' ' + error.message);
                }
            });
        });

        return promise;
    }

    function getById(id) {
        var promise = new Promise(function (resolve, reject) {
            //TODO: refractor using Parse Queries
           getAll().then(function (items) {
               var item;
               items.forEach(function (itemObj) {
                   if (itemObj.id === id) {
                       item = itemObj;
                   }
               });

               if (item) {
                   resolve(item);
               }
               else {
                   reject({
                       message: 'No such item!'
                   });
               }
           });
        });

        return promise;
    }

    function getByIds(idArray) {
        var promise = new Promise(function (resolve) {
            var query = new Parse.Query(Item);
            query.containedIn('objectId', idArray);
            query.find({
                success: function (items) {
                    var mappedItems = _mapItems(items);
                    resolve(mappedItems);
                },
                error: function (err) {
                    console.log(err.message);
                }
            });
        });

        return promise;
    }

    function save(item) {
        var promise = new Promise(function (resolve, reject) {
            var dbItem = new Item();
            dbItem.set('name', item.name);
            dbItem.set('price', item.price);
            dbItem.set('imgSource', item.imgSource);
            dbItem.set('description', item.description);

            dbItem.save(null, {
                success: function (dbItem) {
                    resolve(dbItem);
                }
            })
        });
        return promise;
    }

    function createUser(account) {
        var promise = new Promise(function (resolve, reject) {
            var user = new Parse.User();
            user.set("username", account.name);
            user.set("password", account.password);

            user.signUp(null, {
                success: function (user) {
                    resolve(account);
                    window.location.replace('#/');
                    // Hooray! Let them use the app now.
                },
                error: function (user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert("Error: " + error.code + " " + error.message);
                    reject();
                }
            });
        });
        return promise;

    }

    function logUser(account) {
        console.log('hello');
        var promise = new Promise(function (resolve, reject) {
            Parse.User.logIn(account.name, account.password, {
                success: function (user) {
                    var currentUser = Parse.User.current();
                    if (currentUser) {
                        resolve(account);
                        window.location.replace('#/');
                    } else {
                        // show the signup or login page
                    }

                    resolve();
                },
                error: function (user, error) {
                    // The login failed. Check error to see why.
                    console.log('Failed log in');
                    alert("Error: " + error.code + " " + error.message);
                    reject();
                }
            });
        });
        return promise;
    }

    function search (value) {
        var query = new Parse.Query(Shop);
        return new Promise(function(resolve, reject) {
            query.contains('name', value);
            query.find()
                .then(function(data) {
                    return _mapItems(data);
                })
                .then(function(data) {
                    resolve({shops:data});
                })
        })
    }

    return {
        getAll: getAll,
        getById: getById,
        getByIds: getByIds,
        save: save,
        signUp: createUser,
        signIn: logUser,
        search: search
    };
}());