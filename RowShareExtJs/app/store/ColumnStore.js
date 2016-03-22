Ext.define('RowShareApp.store.ColumnStore', {
    extend: 'Ext.data.Store',

    requires: [
        'RowShareApp.model.ColumnModel',
        'RowShareApp.overrides.data.proxy.Rest',
        'Ext.data.reader.Json'
    ],

    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'ColumnStore',
            autoLoad: false,
            model: 'RowShareApp.model.ColumnModel',
            proxy: {
                //url: 'https://www.rowshare.com/api/column/loadforparent/{listId}',
                url: 'api/column/loadforparent/{listId}',
                type: 'rest',
                                
                actionMethods:{read:'GET'},
                pageParam: false, //to remove param "page"
                startParam: false, //to remove param "start"
                limitParam: false,
                noCache : true,
                reader: {
                    type: 'json'
                }
            }
        }, cfg)]);
    }
});