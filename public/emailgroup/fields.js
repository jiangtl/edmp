Ext.namespace("field.emailgroup");
field.emailgroup = (function(){
    var _this = this;
	var description = {xtype:'textfield',fieldLabel: '描述',name: 'description',anchor:'95%'};
    var num = {xtype:'textfield',fieldLabel: '地址数目',name: 'num',anchor:'95%'};
    var name = {xtype:'textfield',fieldLabel: '邮件集名称',name: 'name',anchor:'95%'};    
    var type = {
        xtype:'combo',
        fieldLabel: '类型',
        emptyText : '',
        name: 'type',
        value:'',
        anchor:'95%',
        resizable:true,
        store: [['', '全部'],['1', '导入'],['2','复制'],['3','合并']],
        triggerAction: 'all',
        editable:false
    }

    var fields = {
        name : name,
        num : num,
        type : type,
        description : description
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
                    var combo = Ext.getCmp(cmpName);
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
        {name:"description", mapping: 'description'},
        {name:"type", mapping: 'type'},
        {name:"num", mapping: 'num'},
        {name:"path", mapping: 'path'}
    ];

    var gridColums = [
        new Ext.grid.RowNumberer(),
        {header: "ID",name:"id", width: 50, dataIndex: 'id', sortable: true,hidden:true},
        {header: "邮件集名称",name:"name", columnWidth: .2, dataIndex: 'name', sortable: true},
        {header: "描述",name:"description", columnWidth: .2, dataIndex: 'description', sortable: true},
        {header: "地址数目",name:"num", columnWidth: .2, dataIndex: 'num', sortable: true},        
        {header: "创建时间",name:"create_at", width: 200, dataIndex: 'create_at', sortable: true},
        {header: "创建人",name:"create_user", columnWidth: .2, dataIndex: 'create_user', sortable: true},
        {header: "类型",name:"type", columnWidth: .2, dataIndex: 'type', sortable: true},
        {header: "路径",name:"path", width: 50, dataIndex: 'path', sortable: true,hidden:true}
    ];

    //自定义查询项
    function getSerchFields() {
        var rows = {
            xtype:"panel",//类型必须有
            layout:"column",
            items:[{
                layout:"form", columnWidth:.33, autoHeight:true, items:[name]
            },{
                layout:"form", columnWidth:.33, autoHeight:true, items:[description]
            },{
                layout:"form", columnWidth:.33, autoHeight:true, items:[type]
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
                    {columnWidth:1,layout: 'form',items: [description]}
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