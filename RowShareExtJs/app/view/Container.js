Ext.define('RowShareApp.view.Container', {
    extend: 'Ext.container.Container',
    alias: 'widget.mycontainer',
    
    requires: [
    'Ext.button.Button', 
    'Ext.tree.Panel', 
    'Ext.tree.View', 
    'Ext.grid.plugin.CellEditing', 
    'Ext.tree.Column'
    ],
    
    referenceHolder: true,
    defaultListenerScope: true,

    layout: {
            type: 'vbox',
            align: 'stretch'
    },
    items: [
    {
        xtype: 'panel',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [
        {
            xtype: 'textfield',
            fieldLabel: 'RowShare list id',
            reference: 'listIdTextField',
            value: '0734e25ecc614f46a9815cda57c560c2',
            // Default value (debug only)
            width: 350,
            allowBlank: false
        }, 
        {
            xtype: 'button',
            text: 'load',
            listeners: {
                click: 'loadButtonClick'
            }
        }, {
            xtype: 'label',
            reference: 'resultText',
            text: 'none'
        }
        ]
    },
    {
        xtype: 'RowShareGrid',
        reference: 'rowShareGrid',
        height: 800
    }
    ],
    
    
    loadButtonClick: function() {
        var me = this;
        var textField = this.lookupReference('listIdTextField');
        var listId = textField.value;
        
        // Load the column store
        var columnStore = Ext.getStore("ColumnStore");
        columnStore.on('load', function(store, records, options) {
            var text = me.lookupReference('resultText');
            text.setText("Columns count: " + records.length);
            me.createGrid(records);
        });
        columnStore.load({
            params: {
                'listId': listId
            }
        });
    },
    
    
    createGrid: function(columnsDefinition) {
        var rowShareGrid = this.lookupReference('rowShareGrid');
        var textField = this.lookupReference('listIdTextField');
        
        for (var i = 0; i < columnsDefinition.length; i++) {
            var column = columnsDefinition[i].data;
            rowShareGrid.addColumn(column);
        }
        rowShareGrid.load(textField.value);
    }
});
