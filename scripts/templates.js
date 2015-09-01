var templates = (function () {
    var cachedTemplates = {};

    function get(templateName) {
        var promise = new Promise(function(resolve, reject) {
            if (cachedTemplates[templateName]) {
                resolve(cachedTemplates[templateName]);
                return;
            }

            var url = 'partials/' + templateName + '.handlebars';

            $.ajax({
                url: url,
                success: function (template) {
                    cachedTemplates[templateName] = template;
                    resolve(template);
                },
                error: function () {
                    reject({
                        message: 'No such template' + templateName + '!'
                    })
                }
            })
        });
        return promise;
    }

    return {
        get: get
    };
}());