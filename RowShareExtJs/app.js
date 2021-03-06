Ext.Loader.setConfig({
    disableCaching: false
});

Ext.application({

    requires: [
        'Ext.Ajax',
        'Ext.Loader'
    ],
    overrides: [
        'RowShareApp.overrides.data.proxy.Rest'
    ],
    stores: [
        'ColumnStore'
    ],
    models: [
        'ColumnModel'
    ],
    views: [
        'Viewport',
        'RowShareApp.view.RowShareGrid'
    ],
    controllers: [],

    name: 'RowShareApp',

    launch: function () {
        Ext.Ajax.cors = true;
        Ext.Ajax.useDefaultXhrHeader = false;
        
        Ext.create('RowShareApp.view.Viewport', { renderTo: Ext.getBody() });
        Ext.theme = {
            name: ""
        };
    }

});