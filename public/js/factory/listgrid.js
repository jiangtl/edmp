Ext.namespace("system.factory");
system.factory.ListGrid = (function(){
    ListGridPanel = function(url, addConfig){       
        //模版默认配置项
        var defaultConifg = {           
            autoShow         : false,
            stripeRows       : true,
            loadMask:{msg:"数据加载中，请稍等..."}           
        };
        
        var allConfig = defaultConifg;
        if(addConfig)
            allConfig = Ext.apply(defaultConifg, addConfig); //合并配置项
            
        ListGridPanel.superclass.constructor.call(this, allConfig); 
    };
    
    Ext.extend(ListGridPanel, Ext.grid.GridPanel, {
        initEvents : function(){
            ListGridPanel.superclass.initEvents.call(this);
        }
    });

    return {
        create : function(url, config) {
            return new ListGridPanel(url, config);
        }, 
        getPageBar : function(store, pageCount) {
            var pagebar = new Ext.PagingToolbar({
                    pageSize: pageCount,
                    store: store,
                    displayInfo: true,              
                    plugins: new Ext.ux.ProgressBarPager()
                })          
            return pagebar;
        }
    }
})();