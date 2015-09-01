var database = (function () {
    function get() {
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

    }

    function save(obj) {

    }
    return {
        get: get,
        getById: getById,
        save: save
    };
}());