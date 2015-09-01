var database = (function () {
    function getAll() {
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                url: 'data/data.json',
                success: function (data) {
                    resolve(data);
                }
            });
        });

        return promise;
    }

    function getById(id) {
        id = +id;
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

    }
    return {
        getAll: getAll,
        getById: getById,
        save: save
    };
}());