var gridId = gridId || 0;

Ext.define('RowShareApp.view.RowShareGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.RowShareGrid',
    
    enableLocking: true,
    stateId: 'RowShareGridStateId',
    stateful: true,
    
    /*
     *          ######### PRIVATE #########
     */
    //TODO: Delete this on grid delete (if extjs doesn't do it)
    modelFields: [],
    gridColumns: [],
    store: null ,
    
    plugins: [
    {
        ptype: 'gridfilters'
    }, 
    {
        ptype: 'cellediting',
        pluginId: 'cellEditorPlugin',
        clicksToEdit: 1
        // TODO
        /*listeners: {
                validateedit: 'onCellEditingValidateedit',
                canceledit: 'onCellEditingCanceledit'
            }*/
    }
    ],
    
    initComponent: function() {
        this.beforeInit();
        this.callParent();
        this.afterInit();
    },
    
    /*
     *  Before the ExtJS initialization
     */
    beforeInit: function() {},
    
    /*
     *  After the ExtJS initialization
     */
    afterInit: function() {},
    
    
    addColumn: function(columnConf) {
        var me = this;
        me.addModelField(columnConf);
        me.addGridColumn(columnConf);
    },
    
    getColumnType(columnConf){
        var colType = columnConf.DataType;
        if (colType === 0) {
            return  'text';
        } else if (colType === 1) {
            return  'number';
        } else if (colType === 2) {
            return 'boolean';
        } else if (colType === 10) {
            return 'date';
        } else if (colType === 11){
            return 'text';  //TODO: time
        } else if(colType === 5){
            return 'fileColumn';
        }
        return 'auto';
    },
        
    getFilterType(columnConf){
        var colType = columnConf.DataType;
        if (colType === 0) {
            return  'string';
        } else if (colType === 1) {
            return  'numeric';
        } else if (colType === 2) {
            return 'boolean';
        } else if (colType === 10) {
            return 'date';
        } else if (colType === 11){
            return 'string';  //TODO: time
        } else if(colType === 5){
            return 'string';
        }
        return 'auto';
    },
    
    addModelField: function(columnConf) {
        var me = this;
        
        var colType = columnConf.DataType;
        var fieldType = me.getColumnType(columnConf);
                
        me.modelFields.push({
            type: fieldType,
            name: columnConf.Id,
        });
    },

    addGridColumn: function(columnConf) {
        var me = this;
        var fieldType = me.getColumnType(columnConf);
        var filterType = me.getFilterType(columnConf);

        me.gridColumns.push(
        {
            text: columnConf.DisplayName,
            dataIndex: columnConf.Id,
            renderer: function(value, metaData, record) {
               var text = record.data.Values[columnConf.DisplayName];
                if(fieldType==='date'){
                    text = /\b\d{13}/.exec(text);
                    text = new Date(parseInt(text[0]));
                }
                return text;
            },
            filter: {
                type: filterType
            },
            sortable: true,
            hideable: true,
            draggable: true,
            groupable: true,
            lockable: true
        }
        );
    },
    
    
    /*
     *  Load the grid
     */
    load: function(listId) {
        var me = this;
        
        // Create a model            
        var model = Ext.define('GridModel' + (gridId++), {
            extend: 'Ext.data.Model',
            fields: me.fields
        });
        
        var store = me.getStore(model);
        me.reconfigure(store, me.gridColumns);
        store.load({
            params: {
                'listId': listId
            }
        });
    },
    
    
    /*
     *  Return a normal store
     */
    getStore: function(model) {
        return Ext.create('Ext.data.Store', {
            model: model,
            storeId: 'ColumnStore' + gridId,
            autoLoad: false,
            proxy: {
                url: 'api/row/loadforparent/{listId}',
                type: 'rest',
                actionMethods: {
                    read: 'GET'
                },
                pageParam: false,
                startParam: false,
                limitParam: false,
                noCache: true,
                reader: {
                    type: 'json'
                }
            }
        });
    },
    
    /**
     *  Add a button on the header to delete the user pref
     */
    addDeleteUserPreferencesButton: function(grid, menu) {
        var suprPref = "Delete user preferences";
        if (menu.items.items[0].text !== suprPref) {
            menu.insert(0, [
            {
                text: suprPref,
                itemId: 'suprPref',
                iconCls: 'extjs-icon-delete',
                handler: function() {
                    Ext.state.Manager.clear(grid.stateId);
                    for (var i = 0; i < grid.initialConfig.columns.length; i++) {
                        if (typeof grid.initialConfig.columns[i].oldWidth != 'undefined')
                            grid.initialConfig.columns[i].width = grid.initialConfig.columns[i].oldWidth;
                    }
                    grid.reconfigure(grid.getStore(), grid.initialConfig.columns);
                    grid.filters.clearFilters();
                    grid.store.clearFilter();
                    grid.view.refresh();
                }
            }, {
                xtype: 'menuseparator'
            }
            ]);
        }
    }
});
