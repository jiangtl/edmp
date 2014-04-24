Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '/ext3/resources/images/default/s.gif';
    Ext.QuickTips.init();
    var fields = field.emailgroup;
    var f_search = system.factory.Search;//搜索框面板
    var f_grid = system.factory.ListGrid;//列表框面板
    //表格初始化
    var gridConfig = {
        region: 'center',
        store: fields.getStore("/emailgroup/", 5),
        columns: fields.getGridColumns(),
        plugins: new Ext.ux.PanelResizer({
            minHeight: 100
        })
    };
    gridConfig.bbar = f_grid.getPageBar(gridConfig.store, 5);

    var searchFields = fields.getSearchFields();
    var dataGrid = f_grid.create("", gridConfig);
    var searchPanel = f_search.create(searchFields , dataGrid, {region:'north',height:80});

    var toolbar = new Ext.Toolbar({
        id:'toolbar',
        region:'north',
        height:30,
        items:[
            {
                text:'查询', iconCls:'icon-search', handler:function(){
                    if(searchPanel.collapsed) {
                        searchPanel.expand(true);
                    } else {
                        searchPanel.collapse(true);
                    }
                }
            },
            {
                text: '创建邮件组',
                iconCls: 'icon-add',
                menu: [
                    {text: '文件导入', handler: function(){
                        events.emailgroup.importTxt(dataGrid);
                    }},{text: '复制', handler: function(){
                        alert("暂未开放");
                    }},{text: '合并', handler: function(){
                        alert("暂未开放");
                    }}
                ]
            },
            {text:'删除', iconCls:'icon-del',handler:function(){
                var records = dataGrid.getSelectionModel().getSelections();
                 var ids = "";
                 for(var i=0;i<records.length;i++) {
                    if(ids == "") {
                        ids = records[i].data.id;
                    } else {
                        ids += ","+records[i].data.id;
                    }               
                 }
                 if(records.length>0) {             
                    Ext.MessageBox.YESNO = {yes:'确认',no:'取消'}; 
                    Ext.MessageBox.confirm("提示","确定这个操作吗？",function (btn){
                        if (btn=="yes") {
                            Ext.Ajax.request({
                                url:'/emailgroup/delete/?id='+ids,
                                success: function(response, opts) {                         
                                    var obj = Ext.decode(response.responseText);
                                    if(obj.msg == 'OK') {
                                        Ext.each(records, dataGrid.store.remove, dataGrid.store);
                                        dataGrid.getSelectionModel().selectRow(0);
                                    } else {
                                        Ext.MessageBox.alert("提示", obj.msg);
                                    }
                                },
                                failure: function(response, opts) {
                                }
                            }); 
                        }
                     },this);
                 } else {
                    Ext.MessageBox.alert("提示","请选择一条记录！");
                 }
                    
            }},
            {text:'查看源文件', iconCls:'icon-txt',handler:function(){
                var records = dataGrid.getSelectionModel().getSelections();
                 if(records.length>0) {             
                    Ext.MessageBox.YESNO = {yes:'确认',no:'取消'}; 
                    Ext.MessageBox.confirm("提示","确定这个操作吗？",function (btn){
                        if (btn=="yes") {
                            window.open(records[0].data.path, records[0].data.name+"导出");
                        }
                     },this);
                 } else {
                    Ext.MessageBox.alert("提示","请选择一条记录！");
                }
            }}
        ]
    });

    var panel = new Ext.Panel({
        region           :'center',
        border           : false,
        layout           : 'border',
        bodyStyle        :'padding:1px;background:#DFE8F6',
        items            :[searchPanel, dataGrid]
    });
    
    var viewport = new Ext.Viewport({
        layout:'border',        
        defaults: {
            scollapsible: true
        },
        items:[toolbar, panel]
    });  
    viewport.doLayout();
});


