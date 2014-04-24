
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = 'ext3/resources/images/default/s.gif';
    Ext.QuickTips.init();
    var sysTreeFactory = system.Tree;
    var panel = new Ext.Panel({
        id:'mainpanel',
        region:'center',
        margins:'0 5 0 0',
        xtype:"viewport",
        layout:'border',
        border:true,
        defaults:{autoScroll: true},
        items:[{
            xtype:'tabpanel',
            id:"pp",
            region:'center',
            activeTab: 0,
            border:false,
            frame:true,
            autoScroll:true,
            enableTabScroll:true,
            bodyStyle:'overflow-y:auto;overflow-x:hidden;background:#DFE8F6'
        }]
    });
    var westPanel = new Ext.Panel({
        region: 'west',
        id: 'west-panel', // see Ext.getCmp() below
        //title: new Date().format("Y年m月d日"), 
        split: true,
        width: 240,
        minSize: 175,
        maxSize: 400,
        autoScroll: true,
        collapsible: true,
        animate: true,
        collapseMode:'mini',
        margins: '0 0 0 5',
        layout: {
            type: 'fit',//'accordion',
            animate: true
        }
    });
    var tree = sysTreeFactory.getSysTree();
    westPanel.add(tree);
    
    function show(){
        var viewport = new Ext.Viewport({
            layout:'border',
            defaults: {
                //scollapsible: true,
                split: true
            },
            items:[ {
                cls: 'docs-header',
                height: 36,
                region:'north',
                xtype:'box',
                el:'header',
                border:false,
                margins: '0 0 0 0'
            }, westPanel, panel,{
                region:'south',
                xtype:'box',
                height:15,
                el:'foot'
            }
            ]
        });
  
        viewport.doLayout();

        setTimeout(function(){
            Ext.get('loading').remove();
            Ext.get('loading-mask').fadeOut({remove:true});
            
        }, 250);
    }
    show();    
});


