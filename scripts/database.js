var database = (function () {
    Parse.initialize("ScOtySOfPiKIxOuM7WU5Huyx6whJFQAP1mNZjx2T", "qtR9xS9VmWmdu1aAlsYMrGXlVMM0Q38DyYCRZNNr");
    //Parse.initialize("JkXEn9Qw4YUF5jfxhtBRtAPlnrbsgHfoSQajlJ5T", "bNmQ0X1xCSMkpfRq0JxCCYWLctPCpljxgMkhlu69");

    var Item = Parse.Object.extend('Item');
    const DEFAULT_STORAGE_ID = 65536;

    function _mapItems(items) {
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
                },
                error: function (user, error) {
                    reject("Error: " + error.message);
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
                        localStorage.setItem('USER_ID', currentUser.id);
                        window.location.replace('#/');
                        resolve(getCurrentUser());
                    } else {
                    }
                },
                error: function (user, error) {
                    reject("Error: " + error.message);
                }
            });
        });
        return promise;
    }

    function logOutUser() {
        var promise = new Promise(function (resolve, reject) {
            Parse.User.logOut();
            localStorage.removeItem('USER_ID');
            window.location.replace('#/');  //so that the button resets to login/signup
            resolve();
        });
        return promise;
    }

    function search(value) {
        var query = new Parse.Query(Shop);
        return new Promise(function (resolve, reject) {
            query.contains('name', value);
            query.find()
                .then(function (data) {
                    return _mapItems(data);
                })
                .then(function (data) {
                    resolve({shops: data});
                })
        })
    }

    function addToCart(item) {
        var promise = new Promise(function (resolve, reject) {
            var currentStorage,
                storageID,
                currentItemIds,
                storageToBeUpdated,
                currentItemId = item.id,
                currentUser = getCurrentUser();
            if (currentUser) {
                storageID = currentUser.id;
            } else {
                storageID = DEFAULT_STORAGE_ID;
            }
            if (localStorage.getItem(storageID)) {
                currentStorage = localStorage.getItem(storageID);
                localStorage.removeItem(storageID);
                currentStorage = JSON.parse(currentStorage);
                currentItemIds = currentStorage.itemIds;
            } else {
                currentItemIds = [];
            }
            currentItemIds.push(currentItemId);
            storageToBeUpdated = {itemIds: currentItemIds};
            storageToBeUpdated = JSON.stringify(storageToBeUpdated);
            localStorage.setItem(storageID, storageToBeUpdated);
            resolve();
        });
        return promise;
    }

    function getCart() {
        var promise = new Promise(function (resolve, reject) {
            var storageID,
                currentStorage,
                currentItemIds,
                currentUser = getCurrentUser();
            if (currentUser) {
                storageID = currentUser.id;
            } else {
                storageID = DEFAULT_STORAGE_ID;
            }
            if (localStorage.getItem(storageID)) {
                currentStorage = localStorage.getItem(storageID);
                currentStorage = JSON.parse(currentStorage);
                currentItemIds = currentStorage.itemIds;
                resolve(currentItemIds);
            }
            resolve([]);
        });
        return promise;
    }

    function clearCart() {
        var promise = new Promise(function (resolve, reject) {
            var storageID,
                currentUser = getCurrentUser();
            if (currentUser) {
                storageID = currentUser.id;
            } else {
                storageID = DEFAULT_STORAGE_ID;
            }
            if (localStorage.getItem(storageID)) {
                localStorage.removeItem(storageID);
            }
            resolve()
        });
        return promise;
    }

    function getCurrentUser() {
        if (localStorage.getItem('USER_ID')) {
            return {
                id: localStorage.getItem('USER_ID')
            };
        } else {
            return null;
        }
    }

    return {
        getAll: getAll,
        getById: getById,
        getByIds: getByIds,
        getCurrent: getCurrentUser,
        getCart: getCart,
        addToCart: addToCart,
        clearCart: clearCart,
        save: save,
        signUp: createUser,
        signIn: logUser,
        signOut: logOutUser,
        search: search
    };
}());