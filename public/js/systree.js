Ext.namespace("system.Tree");
system.Tree = (function(){
    var PATH = "";    var treeData = {"id":"apidocs","iconCls":"icon-files","text":"EDMP","singleClickExpand":true,"children":[    
        {"id":"one","text":"任务","cls":"package","singleClickExpand":true, children:[
            {"text":"任务列表","id":"group100","isClass":true,"iconCls":"cls","cls":"cls","leaf":true,"action":"task/index.html"}  
        ]},
        {"id":"two","text":"模版","cls":"package","singleClickExpand":true, children:[
            {"text":"模版列表","id":"group200","isClass":true,"iconCls":"cls","cls":"cls","leaf":true,"action":"template/index.html"}  
        ]},
        {"id":"three","text":"标题","cls":"package","singleClickExpand":true, children:[
            {"text":"标题列表","id":"group300","isClass":true,"iconCls":"cls","cls":"cls","leaf":true,"action":"title/index.html"}  
        ]},
        {"id":"four","text":"统计","cls":"package","singleClickExpand":true, children:[
            {"text":"投递情况","id":"group400","isClass":true,"iconCls":"cls","cls":"cls","leaf":true,"action":"stat/sendStat.html"},
            {"text":"追踪情况","id":"group401","isClass":true,"iconCls":"cls","cls":"cls","leaf":true,"action":"stat/trackStat.html"}  
        ]},
        {"id":"five","text":"邮件组","cls":"package","singleClickExpand":true, children:[
        	{"text":"邮件组列表","id":"group500","isClass":true,"iconCls":"cls","cls":"cls","leaf":true,"action":"emailgroup/index.html"}
        ]},
        {"id":"six","text":"SC账号","cls":"package","singleClickExpand":true, children:[
        	{"text":"账号列表","id":"group600","isClass":true,"iconCls":"cls","cls":"cls","leaf":true,"action":"scaccount/index.html"}
        ]},
        
    ]};
    if(Ext.util.Cookies.get("username") == "admin") {
    treeData.children.push({"id":"seven","text":"用户管理","cls":"package","singleClickExpand":true, children:[
            {"text":"用户列表","id":"group700","isClass":true,"iconCls":"cls","cls":"cls","leaf":true,"action":"user/index.html?type=2"}
        ]});
    }
    SysTree = function() {
        SysTree.superclass.constructor.call(this, {
            split:true,
            header: false,
            border: false,
            width: 245,
            minSize: 175,
            maxSize: 500,
            collapsible: true,
            margins:'0 0 5 5',
            cmargins:'0 0 0 0',
            rootVisible:false,//显示根节点
            lines:false,
            autoScroll:true,
            animCollapse:false,
            animate: true,
            collapseMode:'mini',                 
            loader: new Ext.tree.TreeLoader({
                preloadChildren: true,
                clearOnLoad: false
            }),
            root: new Ext.tree.AsyncTreeNode({
                text:'',
                id:'root',
                expanded:true,
                children:[treeData]
            }),             
            collapseFirst:false,
            bbar: new Ext.Toolbar({
		        items: [{
		            text: '注销',
		            handler:function(){
			        	window.location.href="/logout";
			        }
		        }]
		    })
        });
    };

    Ext.extend(SysTree, Ext.tree.TreePanel, {
        initComponent: function(){          
            SysTree.superclass.initComponent.call(this);
        }
    });

    //单击
    var createclickGroupHandle = function(){
        return  function(node, e){
            if(node.isLeaf()) {
                var mainPanel = Ext.getCmp("pp");
                var tab = Ext.getCmp('tab'+node.id);    
                if(tab) {
                    tab.destroy();
                    //tab.show();
                    //return;
                }
                
                var infoPanel = new Ext.Panel({
                    id:'tab'+node.id,
                    title : node.text,
                    closable: true,
                    html:'<iframe id="'+node.id+'Frame" name="'+node.id+'meFrame" width="100%" height="100%" src="'+node.attributes.action+'" frameborder="0" scrolling="no"></iframe>'
                });
                
                mainPanel.add(infoPanel);
                mainPanel.setActiveTab(infoPanel)
                mainPanel.doLayout();
            }
        }
    }
   
    return {
        getSysTree : function(url) {            
            var tree = new SysTree();            
            tree.on("afterrender",function(cmp){
            	//cmp.expandPath(cmp.getNodeById("one").getPath());
            	cmp.expandAll();            	
            })
            tree.on('click', createclickGroupHandle());
            return tree
        }
    }    
})();
