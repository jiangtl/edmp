Ext.namespace("field.scaccount");
field.scaccount = (function(){
    var username = {xtype:'textfield',fieldLabel: '账号',name: 'username',anchor:'95%'};
    var password = {xtype:'textfield',fieldLabel: '密码',name: 'password',anchor:'95%'}; 
    var from = {xtype:'textfield',fieldLabel: '发件地址',name: 'from',anchor:'95%'}; 
    var fromname = {xtype:'textfield',fieldLabel: '发件人名称',name: 'fromname',anchor:'95%'}; 
    var fields = {
        username : username,
        password : password,
        fromname : fromname,
        from : from
    }

    var storeField =[
        {name:"id", mapping: '_id'},
        {name:"create_at", mapping: 'create_at'},
        {name:"create_user", mapping: 'create_user'},
        {name:"username", mapping: 'username'},
        {name:"password", mapping: 'password'},
        {name:"from", mapping: 'from'},
        {name:"fromname", mapping: 'fromname'}
    ];

    var gridColums = [
        new Ext.grid.RowNumberer(),
        {header: "ID",name:"id", width: 50, dataIndex: 'id', sortable: true,hidden:true},
        {header: "用户名",name:"username",  width: 200, dataIndex: 'username', sortable: true},
        {header: "发件地址",name:"from",  width: 200, dataIndex: 'from', sortable: true}, 
        {header: "发件人名称",name:"fromname", columnWidth: .2, dataIndex: 'fromname', sortable: true},  
        {header: "创建时间",name:"create_at", width: 200, dataIndex: 'create_at', sortable: true},
        {header: "创建人",name:"create_user", columnWidth: .2, dataIndex: 'create_user', sortable: true},
        {header: "密码",name:"password", columnWidth: .2, dataIndex: 'password', sortable: true,hidden:true}
    ];

    //自定义查询项
    function getSerchFields() {
        var rows = {
            xtype:"panel",//类型必须有
            layout:"column",
            items:[{
                layout:"form", columnWidth:.5, autoHeight:true, items:[username]
            }]
        };
        return [rows];
    }

    function getComList(url, fields, callback) {
        var moduleStore = new Ext.data.JsonStore({
            proxy: new Ext.data.HttpProxy({
                method:"GET",
                url: url
            }),
            fields:fields,
            listeners: {
                load: function() {
                    callback(this);
                }
            }
        });
        moduleStore.load();
        return moduleStore;
    }

    return {
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
                    {columnWidth:1,layout: 'form',items: [username]},
                    {columnWidth:1,layout: 'form',items: [password]},
                    {columnWidth:1,layout: 'form',items: [from]},
                    {columnWidth:1,layout: 'form',items: [fromname]}                    
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
        },
        getAaccountComboBox : function(value) {           
            var store = getComList('/scaccount/getList', ['username','_id'], function(s){
                var query = Ext.isEmpty(value) ? null : {key:"username", value:value};
                if(query) {                    
                    var _id = s.query(query.key, query.value).items[0].data["_id"];
                    var combox = Ext.getCmp("cmpaccountid");                    
                    combox.setValue(query.value);
                    combox.hiddenField.value=_id;
                }
            });
            var combox = new Ext.form.ComboBox({
                id:'cmpaccountid',
                allowBlank : false, 
                emptyText:'选择一个账号',                
                fieldLabel: 'SC账号',
                anchor:'95%',
                resizable:true,
                triggerAction:"all",
                store:store,  // 这个很重要的，设置数据源
                displayField:'username', // 这个是设置下拉框中显示的值
                valueField:'_id',
                hiddenName:'accountId', // 这个可以传到后台的值
                editable: false, // 可以编辑不
                forceSelection: true,
                mode:'local'
           }) 
           return combox;
        }
    }
})();