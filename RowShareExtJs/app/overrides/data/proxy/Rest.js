Ext.define('RowShareApp.overrides.data.proxy.Rest', {
    override: 'Ext.data.proxy.Rest',

    //http://stackoverflow.com/questions/17854420/accessing-complex-rest-resources-with-ext-js
    buildUrl: function(request) {
        var me = this,
            url = me.getUrl(request);
        var added = [];

        // Replace each '{paramName}' by the param value
        var params = request.getParams();
        for (var p in params) {
            if (url.indexOf('{' + p + '}') >= 0) {
                url = url.replace('{' + p + '}', params[p]);
                added.push(p);
            }
        }

        // Remove params from the request
        for (var a in added) {
            delete params[added[a]];
        }

        request.setUrl(url);
        return Ext.data.proxy.Rest.superclass.buildUrl.apply(this, arguments);
    }
});