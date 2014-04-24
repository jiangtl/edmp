Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '/extproject/ext3.2/resources/images/default/s.gif';
    Ext.QuickTips.init();
    
    var myData = [
        {id:1, name:'name1', price:'300', num:'2', date:'2011-4-1', zone:'sy'},
        {id:2, name:'name1', price:'200', num:'2', date:'2011-4-1', zone:'sy'},
        {id:3, name:'name1', price:'324', num:'2', date:'2011-4-1', zone:'sy'},
        {id:4, name:'name1', price:'231', num:'2', date:'2011-4-1', zone:'sy'},
        {id:5, name:'name1', price:'234', num:'2', date:'2011-4-1', zone:'sy'},
        {id:6, name:'name1', price:'453', num:'2', date:'2011-4-1', zone:'sy'},
        {id:7, name:'name1', price:'300', num:'2', date:'2011-4-1', zone:'sy'},
        {id:8, name:'name1', price:'300', num:'2', date:'2011-4-1', zone:'sy'},
        {id:9, name:'name1', price:'300', num:'2', date:'2011-4-1', zone:'sy'},
        {id:10, name:'name1', price:'300', num:'2', date:'2011-4-1', zone:'sy'},
        {id:11, name:'name1', price:'300', num:'2', date:'2011-4-1', zone:'sy'}
    ]
    
    var colums1 = [
        {header: "编号",name:"id", columnWidth: .2, dataIndex: 'id', sortable: true},
        {id:'name',header: "名称",name:"name", columnWidth: .2, dataIndex: 'name', sortable: true},
        {header: "价格",name:"price", columnWidth: .2, dataIndex: 'price', sortable: true},
        {header: "数量",name:"num", columnWidth: .2, dataIndex: 'num', sortable: true},
        {header: "日期",name:"date", columnWidth: .2, dataIndex: 'date', sortable: true},
        {header: "区域",name:"zone", columnWidth: .2, dataIndex: 'zone', sortable: true}
    ]
    
    
    
    var store1 = new Ext.data.JsonStore({
        data : myData,
        fields : [
            {name:'id', mapping:'id'},
            {name:'name', mapping:'name'},
            {name:'price', mapping:'price'},
            {name:'num', mapping:'num'},
            {name:'date', mapping:'date'},
            {name:'zone', mapping:'zone'}
        ]
    });
    
    
    var grid1 = new Ext.grid.GridPanel({
        region           :'north',
        height: 350,
        autoShow         : false,
        stripeRows       : true,
        store            : store1,
        columns          : colums1,
        autoExpandColumn : 'name',
        title            : '列表页'
    })
    
    /* var myData = [
     {company:'3m Co',price:71.72,change:0.02,pctChange:0.03,lastChange:'9/1 12:00am'},
        {company:'Alcoa Inc',price:29.01,change:0.42,pctChange:1.47,lastChange:'9/1 12:00am'},
        {company:'Altria Group Inc',price:83.81,change:0.28,pctChange:0.34,lastChange:'9/1 12:00am'}
        
    ];

    *//**
     * Custom function used for column renderer
     * @param {Object} val
     *//*
    function change(val){
        if(val > 0){
            return '<span style="color:green;">' + val + '</span>';
        }else if(val < 0){
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    }

    *//**
     * Custom function used for column renderer
     * @param {Object} val
     *//*
    function pctChange(val){
        if(val > 0){
            return '<span style="color:green;">' + val + '%</span>';
        }else if(val < 0){
            return '<span style="color:red;">' + val + '%</span>';
        }
        return val;
    }

    // create the data store
    var store = new Ext.data.JsonStore({
        fields: [
           {name: 'company', mapping:'company'},
           {name: 'price', mapping:'price', type: 'float'},
           {name: 'change', mapping:'change', type: 'float'},
           {name: 'pctChange', mapping:'pctChange', type: 'float'},
           {name: 'lastChange', mapping:'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
        ],
        data:myData
    });

    // manually load local data
    //store.loadData(myData);

    // create the Grid
    var grid = new Ext.grid.GridPanel({
        region:'north',
        store: store,
        columns: [
            {id:'company',header: 'Company', width: 160, sortable: true, dataIndex: 'company'},
            {header: 'Price', width: 75, sortable: true, renderer: 'usMoney', dataIndex: 'price'},
            {header: 'Change', width: 75, sortable: true, renderer: change, dataIndex: 'change'},
            {header: '% Change', width: 75, sortable: true, renderer: pctChange, dataIndex: 'pctChange'},
            {header: 'Last Updated', width: 85, sortable: true, renderer: Ext.util.Format.dateRenderer('m/d/Y'), dataIndex: 'lastChange'}
        ],
        stripeRows: true,
        autoExpandColumn: 'company',
        height: 350,
        width: 600,
        title: 'Array Grid',
        // config options for stateful behavior
        stateful: true,
        stateId: 'grid'        
    });*/
    
    
    var viewport = new Ext.Viewport({
        layout:'border',
        defaults: {
            //scollapsible: true,
            split: true
        },
        items:[grid1,
            new Ext.Panel({title:'center',region:'center'}),new Ext.Panel({title:'south',region:'south',height:100})
        ]
    });
    
    viewport.doLayout();
});


