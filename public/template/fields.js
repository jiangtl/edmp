Ext.namespace("field.template");
field.template = (function(){
	var html = {xtype:'textarea',fieldLabel: '内容',name: 'html',anchor:'95%',allowBlank: false};
    var name = {xtype:'textfield',fieldLabel: '名称',name: 'name',anchor:'95%',allowBlank: false};    
    var deadline = {xtype:'datefield',fieldLabel: '有效日期',name: 'deadline',anchor:'95%',format:'Y-m-d'};    
    var fields = {
        name : name,
        html : html,
        deadline : deadline
    }

    var storeField =[
        {name:"id", mapping: '_id'},
        {name:"create_at", mapping: 'create_at'},
        {name:"create_user", mapping: 'create_user'},
        {name:"name", mapping: 'name'},
        {name:"deadline", mapping: 'deadline'},
        {name:"html", mapping: 'html'}
    ];

    var gridColums = [
        new Ext.grid.RowNumberer(),
        {header: "ID",name:"id", width: 50, dataIndex: 'id', sortable: true,hidden:true},
        {header: "模版名称",name:"name", width: 300, dataIndex: 'name', sortable: true}, 
        {header: "有效截止日期",name:"deadline", columnWidth: .2, dataIndex: 'deadline', sortable: true},       
        {header: "创建时间",name:"create_at", width: 200, dataIndex: 'create_at', sortable: true},
        {header: "创建人",name:"create_user", columnWidth: .2, dataIndex: 'create_user', sortable: true},
        {header: "模版内容",name:"html", columnWidth: .2, dataIndex: 'html', sortable: true,hidden:true}
    ];

    //自定义查询项
    function getSerchFields() {
        var rows = {
            xtype:"panel",//类型必须有
            layout:"column",
            items:[{
                layout:"form", columnWidth:.5, autoHeight:true, items:[name]
            }]
        };
        return [rows];
    }

    return {
        pname : name,
        //获得查询面板的查询项
        getSearchFields :  function(url, config) {
            return getSerchFields();
        },
        //查看页
        getBrowseFields : function() {
            var rows = {
                xtype:"panel",//类型必须有
                layout:'column',
                items:[
                    {columnWidth:1,layout: 'form',items: [name]},
                    {columnWidth:1,layout: 'form',items: [html]},
                    {columnWidth:1,layout: 'form',items: [deadline]}
                ]
            }
            return [rows];
        },
        getStoreField : function() {
            return storeField;
        },
        getStore : function(url, pageCount) {
            var store = new Ext.data.JsonStore({
                proxy: new Ext.data.HttpProxy({
                //proxy: new Ext.data.ScriptTagProxy({
                    method: 'GET',
                    //prettyUrls: false,
                    url:url
                }),
                //reader: new Ext.data.JsonReader({
                root : "rows",
                totalProperty : "totalCount",
                fields:storeField
                //})
            });
            store.load({params:{start:0, limit:pageCount}});
            return store;
        },
        getGridColumns: function() {
            return gridColums;
        },
        getField : function(name) {
            return fields[name];
        }
    }
})();