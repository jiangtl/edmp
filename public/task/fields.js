Ext.namespace("field.task");
field.task = (function(){
    var s_name = {xtype:'textfield',fieldLabel: '名称',name: 'name',anchor:'95%'};
    var s_title = {xtype:'textfield',fieldLabel: '标题',name: 'title',anchor:'95%'};   
    var s_template = {xtype:'textfield',fieldLabel: '模版',name: 'template',anchor:'95%'};
    var s_scaccount = {xtype:'textfield',fieldLabel: '发送账号',name: 'scaccount',anchor:'95%'}; 

    var fields = {

    }

    var storeField =[
        {name:"id", mapping: '_id'},
        {name:"create_at", mapping: 'create_at'},
        {name:"create_user", mapping: 'create_user'},
        {name:"name", mapping: 'name'},
        {name:"template", mapping: 'template'},
        {name:"scaccount", mapping: 'scaccount'},        
        {name:"title", mapping: 'title'},
        {name:"email_group", mapping: 'email_group'},
        {name:"sendtime", mapping:'sendtime'},
        {name:"status", mapping:'status'},
        {name:"labelId", mapping:'labelId'},
        {name:"num", mapping:'num'},
        {name:"status", mapping:'status'}
    ];

    var gridColums = [
        new Ext.grid.RowNumberer(),
        {header: "ID",name:"id", width: 50, dataIndex: 'id', sortable: true,hidden:true},
        {header: "任务名称",name:"name", columnWidth: .2, dataIndex: 'name', sortable: true},
        {header: "标题",name:"title", columnWidth: .2, dataIndex: 'title', sortable: true},
        {header: "模版",name:"template", columnWidth: .2, dataIndex: 'template', sortable: true},
        {header: "邮件组",name:"email_group", columnWidth: .2, dataIndex: 'email_group', sortable: true},
        {header: "发送账号",name:"scaccount", columnWidth: .2, dataIndex: 'scaccount', sortable: true},
        {header: "发送时间",name:"sendtime", columnWidth: .2, dataIndex: 'sendtime', sortable: true},
        {header: "邮件数量",name:"num", columnWidth: .2, dataIndex: 'num', sortable: true},
        {header: "状态",name:"status", columnWidth: .2, dataIndex: 'status', sortable: true},
        {header: "标签",name:"labelId", columnWidth: .2, dataIndex: 'labelId', sortable: true,hidden:true},
        {header: "创建时间",name:"create_at", columnWidth: .2, dataIndex: 'create_at', sortable: true},
        {header: "创建人",name:"create_user", columnWidth: .2, dataIndex: 'create_user', sortable: true}
    ];

    //自定义查询项
    function getSerchFields() {
        var rows = {
            xtype:"panel",//类型必须有
            layout:"column",
            items:[{
                layout:"form", columnWidth:.25, autoHeight:true, items:[s_name]             
            },{
                layout:"form", columnWidth:.25, autoHeight:true, items:[s_title]
            },{
                layout:"form", columnWidth:.25, autoHeight:true, items:[s_template]
            },{
                layout:"form", columnWidth:.25, autoHeight:true, items:[s_scaccount]
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
                    //callback(this);
                }
            }
        });
        moduleStore.load();
        return moduleStore;
    }

    return {
        pname : name,
        //获得查询面板的查询项
        getSearchFields :  function(url, config) {
            return getSerchFields();
        },
        //查看页
        getBrowseFields : function(scvalue, tplvalue, egroupvalue,tgroupvalue) {
            var scstore = getComList('/scaccount/getList', ['username','_id'], function(s){
                var query = Ext.isEmpty(scvalue) ? null : {key:"username", value:scvalue};
                if(query) {                    
                    var _id = s.query(query.key, query.value).items[0].data["_id"];
                    var combox = Ext.getCmp("cmpaccountid");                    
                    combox.setValue(query.value);
                    combox.hiddenField.value=_id;
                }
            });
            var tplstore = getComList('/template/getList', ['name','_id'], function(s){
                var query = Ext.isEmpty(tplvalue) ? null : {key:"name", value:tplvalue};
                if(query) {                    
                    var _id = s.query(query.key, query.value).items[0].data["_id"];
                    var combox = Ext.getCmp("cmptplid");                    
                    combox.setValue(query.value);
                    combox.hiddenField.value=_id;
                }
            });
            var egroupstore = getComList('/emailgroup/getList', ['name','_id'], function(s){
                var query = Ext.isEmpty(egroupvalue) ? null : {key:"name", value:egroupvalue};
                if(query) {                    
                    var _id = s.query(query.key, query.value).items[0].data["_id"];
                    var combox = Ext.getCmp("cmpegroupid");                    
                    combox.setValue(query.value);
                    combox.hiddenField.value=_id;
                }
            });
            var tgroupstore = getComList('/title/getList', ['name','_id'], function(s){
                var query = Ext.isEmpty(tgroupvalue) ? null : {key:"name", value:tgroupvalue};
                if(query) {                    
                    var _id = s.query(query.key, query.value).items[0].data["_id"];
                    var combox = Ext.getCmp("cmptgroupid");                    
                    combox.setValue(query.value);
                    combox.hiddenField.value=_id;
                }
            });
            var sccombox = new Ext.form.ComboBox({
                id:'cmpaccountid',
                allowBlank : false, 
                emptyText:'选择一个账号',                
                fieldLabel: 'SC账号',
                anchor:'95%',
                resizable:true,
                triggerAction:"all",
                store:scstore,  // 这个很重要的，设置数据源
                displayField:'username', // 这个是设置下拉框中显示的值
                valueField:'_id',
                name:'scaccount',
                //hiddenName:'scaccount', // 这个可以传到后台的值
                editable: false, // 可以编辑不
                forceSelection: true,
                mode:'local'
            }) 

            var tplcombox = new Ext.form.ComboBox({
                id:'cmptplid',
                allowBlank : false, 
                emptyText:'选择一个模版',                
                fieldLabel: '模版',
                anchor:'95%',
                resizable:true,
                triggerAction:"all",
                store:tplstore,  // 这个很重要的，设置数据源
                displayField:'name', // 这个是设置下拉框中显示的值
                valueField:'_id',
                name:'template',
                //hiddenName:'template', // 这个可以传到后台的值
                editable: false, // 可以编辑不
                forceSelection: true,
                mode:'local'
            }) 

            var egroupcombox = new Ext.form.ComboBox({
                id:'cmpegroupid',
                allowBlank : false, 
                emptyText:'选择一个邮件组',                
                fieldLabel: '邮件组',
                anchor:'95%',
                resizable:true,
                triggerAction:"all",
                store:egroupstore,  // 这个很重要的，设置数据源
                displayField:'name', // 这个是设置下拉框中显示的值
                valueField:'_id',
                name:'email_group',
                //hiddenName:'email_group', // 这个可以传到后台的值
                editable: false, // 可以编辑不
                forceSelection: true,
                mode:'local'
            })

            var tgroupcombox = new Ext.form.ComboBox({
                id:'cmptgroupid',
                allowBlank : false, 
                emptyText:'选择一个标题',                
                fieldLabel: '标题',
                anchor:'95%',
                resizable:true,
                triggerAction:"all",
                store:tgroupstore,  // 这个很重要的，设置数据源
                displayField:'name', // 这个是设置下拉框中显示的值
                valueField:'_id',
                name:'title',
                //hiddenName:'title', // 这个可以传到后台的值
                editable: false, // 可以编辑不
                forceSelection: true,
                mode:'local'
            })

            var rows = {
                xtype:"panel",//类型必须有
                layout:'column',
                items:[
                    {columnWidth:1,layout: 'form',items: [Ext.apply({"allowBlank" : false },s_name)]},
                    {columnWidth:1,layout: 'form',items: [egroupcombox]},
                    {columnWidth:1,layout: 'form',items: [tplcombox]},
                    {columnWidth:1,layout: 'form',items: [tgroupcombox]},
                    {columnWidth:1,layout: 'form',items: [sccombox]}
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