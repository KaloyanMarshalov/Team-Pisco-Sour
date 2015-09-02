var database = (function () {
    Parse.initialize("ScOtySOfPiKIxOuM7WU5Huyx6whJFQAP1mNZjx2T", "qtR9xS9VmWmdu1aAlsYMrGXlVMM0Q38DyYCRZNNr");

    var Item = Parse.Object.extend('Item');

    function getAll() {
        var promise = new Promise(function (resolve, reject) {
            var query = new Parse.Query(Item);

            query.find({
                success: function (items) {
                    var mappedItems = items.map(function (item) {
                        var returnItem = {};
                        returnItem.id = item.id
                        returnItem.name = item.get('name');
                        returnItem.price = item.get('price');
                        returnItem.imgSource = item.get('imgSource');

                        return returnItem;
                    });
                    
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

    function save(item) {
        var promise = new Promise(function (resolve, reject) {
            var dbItem = new Item();
            dbItem.set('name', item.name);
            dbItem.set('price', item.price);
            dbItem.set('imgSource', item.imgSource);

            dbItem.save()
                .then(function () {
                    console.log('item saved!');
                    resolve(dbItem);
                })
        });
        return promise
    }
    return {
        getAll: getAll,
        getById: getById,
        save: save
    };
}());