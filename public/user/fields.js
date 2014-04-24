Ext.namespace("field.scaccount");
field.scaccount = (function(){
    var s_login_name = {xtype:'textfield',fieldLabel: '登录名',name: 'login_name',anchor:'95%'};
    var s_name = {xtype:'textfield',fieldLabel: '姓名',name: 'name',anchor:'95%'}; 
    var login_name = Ext.apply({allowBlank : false },s_login_name);
    var name = Ext.apply({allowBlank : false },s_name);
    var password = {xtype:'textfield',fieldLabel: '密码',name: 'password',anchor:'95%',allowBlank : false}; 
    var email = {xtype:'textfield',fieldLabel: 'Email',name: 'email',anchor:'95%'};     
    var company = {xtype:'textfield',fieldLabel: '公司',name: 'company',anchor:'95%'}; 
    var phone = {xtype:'textfield',fieldLabel: '电话',name: 'phone',anchor:'95%'};
    var address = {xtype:'textfield',fieldLabel: '地址',name: 'address',anchor:'95%'};
    //var accounts = {xtype:'textfield',fieldLabel: '账号',name: 'accounts',anchor:'95%'};
    //var accountpwd = {xtype:'textfield',fieldLabel: '账号密码',name: 'accountpwd',anchor:'95%'}; 
    //var from = {xtype:'textfield',fieldLabel: '发件地址',name: 'from',anchor:'95%'}; 
    //var fromname = {xtype:'textfield',fieldLabel: '发件人名称',name: 'fromname',anchor:'95%'}; 

    var sex = {
        xtype:'combo',
        fieldLabel: '性别',
        emptyText : '请选择性别',
        name: 'sex',
        anchor:'95%',
        resizable:true,
        store: [['男', '男'],['女','女']],
        triggerAction: 'all',
        editable:false
    } 

    var fields = {
        login_name : login_name,
        password : password,
        name : name,
        company : company
    }
    var storeField =[
        {name:"id", mapping: '_id'},
        {name:"create_at", mapping: 'create_at'},
        {name:"create_user", mapping: 'create_user'},
        {name:"login_name", mapping: 'login_name'},
        {name:"password", mapping: 'password'},
        {name:"email", mapping: 'email'},
        {name:"name", mapping: 'name'},
        {name:"company", mapping: 'company'},
        {name:"phone", mapping: 'phone'},
        {name:"sex", mapping: 'sex'},
        {name:"address", mapping: 'address'},
        {name:"accounts", mapping: 'account'}
    ];

    var gridColums = [
        new Ext.grid.RowNumberer(),
        {header: "ID",name:"id", width: 50, dataIndex: 'id', sortable: true,hidden:true},
        {header: "用户名",name:"login_name",  columnWidth: .2, dataIndex: 'login_name', sortable: true},
        {header: "姓名",name:"name",  columnWidth: .2, dataIndex: 'name', sortable: true}, 
        {header: "性别",name:"sex",  columnWidth: .2, dataIndex: 'sex', sortable: true}, 
        {header: "公司",name:"company",  width: 200, dataIndex: 'company', sortable: true}, 
        {header: "Email",name:"email", columnWidth: .2, dataIndex: 'email', sortable: true}, 
        {header: "电话",name:"phone",  columnWidth: .2, dataIndex: 'phone', sortable: true}, 
        {header: "地址",name:"address", columnWidth: .2, dataIndex: 'address', sortable: true}, 
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
                layout:"form", columnWidth:.5, autoHeight:true, items:[s_login_name]
            },{
                layout:"form", columnWidth:.5, autoHeight:true, items:[s_name]
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
                    {columnWidth:.5,layout: 'form',items: [name]},
                    {columnWidth:.5,layout: 'form',items: [sex]},  
                    {columnWidth:.5,layout: 'form',items: [login_name]},
                    {columnWidth:.5,layout: 'form',items: [password]},
                    {columnWidth:.5,layout: 'form',items: [email]},
                    {columnWidth:.5,layout: 'form',items: [phone]},                       
                    {columnWidth: 1,layout: 'form',items: [company]},
                    {columnWidth: 1,layout: 'form',items: [address]}
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
            var store = getComList('/user/getAccountList', ['name','_id'], function(s){
                var query = Ext.isEmpty(value) ? null : {key:"name", value:value};
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