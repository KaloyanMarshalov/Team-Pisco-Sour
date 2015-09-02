var templates = (function () {
    var cachedTemplates = {},
        handlebars=window.Handlebars||window.handlebars,
        Handlebars=window.handlebars||window.Handlebars;

    function get(templateName) {
        var promise = new Promise(function(resolve, reject) {
            if (cachedTemplates[templateName]) {
                resolve(cachedTemplates[templateName]);
                return;
            }

            var url = 'partials/' + templateName + '.handlebars';

            $.ajax({
                url: url,
                success: function (templateHtml) {
                    var template=handlebars.compile(templateHtml);
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