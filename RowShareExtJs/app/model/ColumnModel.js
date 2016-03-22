Ext.define('RowShareApp.model.ColumnModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.field.Field'
    ],

    fields: [
        {
            name: 'Id'
        },
        {
            name: 'ListId'
        },
        {
            name: 'ColumnTypeId'
        },
        {
            name: 'DisplayName'
        },
        {
            name: 'DataType'
        },
        {
            name: 'IsReadOnly'
        },
        {
            name: 'Index'
        },
        {
            name: 'SortOrder'
        },
        {
            name: 'MaxDecimals'
        },
        {
            name: 'MaxLength'
        },
        {
            name: 'Options'
        }
    ]
});