Ext.namespace("system.factory");
system.factory.Search = (function(){
    var _start = 0;
    var _limit = 10;
     /**
     * gridPanel : 目标表格(数据显示)
     * addConfig : 用户自定义的面板配置项
     */
    SearchPanel = function(gridPanel, addConfig) {
        //模版默认配置项
        var defaultConifg = {           
            frame           : true,
            border          : false,
            animCollapse    : false,
            animate         : true,
            collapseMode    : 'mini',
            layout          : "form",
            labelWidth      : 70,
            labelAlign      : "right",
            defaultType     : "textfield",
            buttonAlign     : "center",
            targetGrid      : gridPanel
        };
        
        var allConfig = defaultConifg;
        if(addConfig)
            allConfig = Ext.apply(defaultConifg, addConfig); //合并配置项

        SearchPanel.superclass.constructor.call(this, allConfig);
    };

    Ext.extend(SearchPanel, Ext.form.FormPanel, {
        initComponent: function(){
            var obj = this;
            Ext.apply(this,{buttons:[{
                text:'确定',
                type:'submit',
                 listeners: {
                    "click": function() {
                        var form = obj.getForm();
                        if(form.isValid()){
                            var submitValue = {};
                            var items = form.items;
                            for(var i=0; i<items.length; i++ ) {
                                var field = items.itemAt(i);
                                submitValue[field.name] = field.getValue();
                            }                           
                            Ext.apply(obj.targetGrid.getStore().baseParams, submitValue);
                            obj.targetGrid.getStore().load({params:{start:obj.start || 0, limit:obj.limit || 10}});                           
                        }
                    }
                }               
            },{
                text:'取消',
                handler:function(){obj.getForm().reset();}//表单重置
            }]})

            SearchPanel.superclass.initComponent.call(this);            
        },
        listeners:{}
    });
    
    return {
        /**
         * 创建查询面板,返回这个面板.        
         * fields : 查询条件
         * gridPanel : 指定数据加载表格
         * config : 属性配置项
         * add by jiangtl 2011-4-7
         */
        create : function(fields, gridPanel, config) {
            var searchPanel = new SearchPanel(gridPanel, config);
            for(var i = 0 ; i < fields.length; i++) {
                searchPanel.add(fields[i]);
            }           
            return searchPanel
        }
    }
})()