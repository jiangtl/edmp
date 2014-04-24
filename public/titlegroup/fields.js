Ext.namespace("field.titlegroup");
field.titlegroup = (function(){
	var title = {xtype:'textfield',fieldLabel: '标题',name: 'title_list',anchor:'95%'};
    var name = {xtype:'textfield',fieldLabel: '标题组名称',name: 'name',anchor:'95%'};    
  
    var fields = {
        name : name,
        title : title
    }

    function getComList(url, fields, cmpName) {
        var moduleStore =new Ext.data.Store({
            proxy: new Ext.data.ScriptTagProxy({
                url: url //'/index.php?c=template&fun=get'  //这个是url，就是你要取的值到下拉框中的
            }),
            reader: new Ext.data.JsonReader({
                root: 'rows',
                fields: fields //['tname','tpid'] //跟后面的ComboBox的displayField和valueField对于
            }),  //这个是加监听事件，就提供一下，可以不用的
            listeners: {
                load: function() {
                    var combo = Ext.getCmp(cmpName);//'template'
                    combo.setValue(combo.getValue());
                }
            }
        });
        moduleStore.load();
        return moduleStore;
    }

    var storeField =[
        {name:"id", mapping: '_id'},
        {name:"create_at", mapping: 'create_at'},
        {name:"create_user", mapping: 'create_user'},
        {name:"name", mapping: 'name'},
        {name:"title_list", mapping: 'title_list'}
    ];

    var gridColums = [
        new Ext.grid.RowNumberer(),
        {header: "ID",name:"id", width: 50, dataIndex: 'id', sortable: true,hidden:true},
        {header: "标题组名称",name:"name", width: 300, dataIndex: 'name', sortable: true},      
        {header: "创建时间",name:"create_at", width: 200, dataIndex: 'create_at', sortable: true},
        {header: "创建人",name:"create_user", columnWidth: .2, dataIndex: 'create_user', sortable: true},
        {header: "标题内容",name:"title_list", columnWidth: .2, dataIndex: 'title_list', sortable: true,hidden:true}
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
                    {columnWidth:1,layout: 'form',items: [title]},
                    {columnWidth:1,layout: 'form',items: [title]},
                    {columnWidth:1,layout: 'form',items: [title]}
                    
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