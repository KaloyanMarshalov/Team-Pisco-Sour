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
        var promise = new Promise(function (resolve, reject) {
           getAll().then(function (items) {
               var item = items.find(function (item) {
                   return item.id === id;
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