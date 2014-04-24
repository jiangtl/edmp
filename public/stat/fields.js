Ext.namespace("field.stat");
field.stat = (function(){	

	var stime = {xtype:'datefield',fieldLabel: '开始日期',name: 'stime',anchor:'95%',format:'Y-m-d'};
    var etime = {xtype:'datefield',fieldLabel: '结束日期',name: 'etime',anchor:'95%',format:'Y-m-d'};
	
    var dateScope = {
		xtype:'combo',
        fieldLabel: '时间段',
        emptyText : '选择一个时间段',
        name: 'dateScope',
        anchor:'95%',
        resizable:true,
        store: [['0', '今天'],['-1','昨天'],['7','最近7天'],['30','最近30天']],
        triggerAction: 'all',
        editable:false,
		listeners:{// 添加一个监听事件
		 	'select':function(combo,record,index) { // 选择的时候的事件
		      	var day = parseInt(combo.getValue());
				var searchPanel = Ext.getCmp('searchStat1');
				var startDate = searchPanel.getForm().findField("stime");
				var endDate = searchPanel.getForm().findField("etime");
				var cdate = new Date();
				var edate = new Date(cdate.getTime() - day*24*60*60*1000);
				if(day > 0) {					
					startDate.setValue(edate);
					endDate.setValue(cdate);
				} else if (day < 0) {
					edate = new Date(cdate.getTime() + day*24*60*60*1000);
					startDate.setValue(edate);
					endDate.setValue(edate);
				} else {
					startDate.setValue(cdate);
					endDate.setValue(cdate);
				}
			}	
		}  
	} 
	
	function getComList(url, fields, cmpName) {
		var moduleStore =new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				method:'GET',
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
	
	var taskList = new Ext.form.ComboBox({
		emptyText:'选择一个任务',    // 这个是下拉框为空的时候 显示的文字
		id:'taskid', // 如果一个页面中有多个combobox的话，这个id不能取成一样，刚开始取成一样的了，结果点下拉框的时候，现在在另一个下拉框中。
		fieldLabel: '任务',
		name: 'taskid',
		anchor:'95%',
		resizable:true,
		triggerAction:"all",
		store:getComList('/task', ['name','labelId'], 'taskid'),  // 这个很重要的，设置数据源
		displayField:'name', // 这个是设置下拉框中显示的值
		valueField:'labelId', // 这个可以传到后台的值
		editable: true, // 可以编辑不
		forceSelection: false,
		mode:'remote',// 数据来源本地local,远程就是remote
		listeners:{// 添加一个监听事件
		 	'select':function(combo,record,index) { // 选择的时候的事件
		      	//Ext.getCmp('bid').clearValue(); // 这个是取到valueField的值
			}	
		}  
	})
    
    var storeField =[	
		//{name:"id", mapping: 'id'},     
        {name:"taskId", mapping: 'taskId'},
        {name:"batchId", mapping: 'batchId'},
        {name:"date", mapping: 'date'},
        {name:"request", mapping: 'request'},
        {name:"deliver", mapping: 'deliver'},
        {name:"deliverRate", mapping: 'deliverRate'},
        {name:"open", mapping: 'open'},
		{name:"openRate", mapping: 'openRate'},     
        {name:"singleOpen", mapping: 'singleOpen'},
        {name:"singleOpenRate", mapping: 'singleOpenRate'},
        {name:"click", mapping: 'click'},
        {name:"clickRate", mapping: 'clickRate'},
        {name:"singleClick", mapping: 'singleClick'},
        {name:"singleClickRate", mapping: 'singleClickRate'},
        {name:"unsubscribe", mapping: 'unsubscribe'},
		{name:"invalid", mapping: 'invalid'},
		{name:"invalidRate", mapping: 'invalidRate'},     
        {name:"bounce", mapping: 'bounce'},
        {name:"bounceRate", mapping: 'bounceRate'},
        {name:"soft_bounce", mapping: 'soft_bounce'},
        {name:"soft_bounceRate", mapping: 'soft_bounceRate'},
        {name:"spam", mapping: 'spam'},
        {name:"spamRate", mapping: 'spamRate'},
        {name:"report_spam", mapping: 'report_spam'},
		{name:"report_spamRate", mapping: 'report_spamRate'}
	];
	
    var gridColums = [
    	new Ext.grid.RowNumberer(),
        //{header: "ID",name:"id", width: 50, dataIndex: 'id', sortable: true,hidden:true}, 
        {header: "日期",name:"date", columnWidth: .2, dataIndex: 'date', sortable: true},
        {header: "请求",name:"request", columnWidth: .2, dataIndex: 'request', sortable: true},
        {header: "发送",name:"deliver", columnWidth: .2, dataIndex: 'deliver', sortable: true},
        {header: "无效邮件",name:"invalid", columnWidth: .2, dataIndex: 'invalid', sortable: true},
        {header: "软退信",name:"bounce", columnWidth: .2, dataIndex: 'bounce', sortable: true},
        {header: "垃圾邮件",name:"spam", columnWidth: .2, dataIndex: 'spam', sortable: true},
		{header: "垃圾邮件举报",name:"report_spam", columnWidth: .2, dataIndex: 'report_spam', sortable: true}
    ];
        
   var gridColumsTrack = [
    	new Ext.grid.RowNumberer(),
       // {header: "ID",name:"id", width: 50, dataIndex: 'id', sortable: true,hidden:true}, 
        {header: "日期",name:"date", columnWidth: .2, dataIndex: 'date', sortable: true},
        {header: "请求",name:"request", columnWidth: .2, dataIndex: 'request', sortable: true},
        {header: "打开",name:"open", columnWidth: .2, dataIndex: 'open', sortable: true},        
        {header: "点击",name:"click", columnWidth: .2, dataIndex: 'click', sortable: true},        
		{header: "取消订阅",name:"unsubscribe", columnWidth: .2, dataIndex: 'unsubscribe', sortable: true}
    ];
    //自定义查询项
    function getSerchFields() {
		var rows = {
		      xtype:"panel",//类型必须有
		      layout:"column",
		      items:[{layout:"form",columnWidth:.25,autoHeight:true,items:[dateScope]
		      },{layout:"form",columnWidth:.25,autoHeight:true,items:[stime]		      	
		      },{layout:"form",columnWidth:.25,autoHeight:true,items:[etime]},
		      {layout:"form",columnWidth:.25,autoHeight:true,items:[taskList]}]
		};		
    	return [rows];
    } 
    
    var myDatas = {rows: [
    	{id:1, date:"2013-10-29", request:1000,send:1000, invalid:3, soft_bounce:28,report_spam:300,spam:4000},
		{id:2, date:"2013-10-28", request:1000,send:1000, invalid:3, soft_bounce:28,report_spam:300,spam:4000},
		{id:3, date:"2013-10-27", request:1000,send:1000, invalid:3, soft_bounce:28,report_spam:300,spam:4000},
		{id:4, date:"2013-10-26", request:1000,send:1000, invalid:3, soft_bounce:28,report_spam:300,spam:4000},
		{id:5, date:"2013-10-25", request:1000,send:1000, invalid:3, soft_bounce:28,report_spam:300,spam:4000},
		{id:6, date:"2013-10-24", request:1000,send:1000, invalid:3, soft_bounce:28,report_spam:300,spam:4000},
		{id:7, date:"2013-10-23", request:1000,send:1000, invalid:3, soft_bounce:28,report_spam:300,spam:4000},
		{id:8, date:"2013-10-22", request:1000,send:1000, invalid:3, soft_bounce:28,report_spam:300,spam:4000},
		{id:9, date:"2013-10-21", request:1000,send:1000, invalid:3, soft_bounce:28,report_spam:300,spam:4000}
	]};    
    
	return {
        //获得查询面板的查询项
        getSearchPanelFields :  function(url, config) {
            return getSerchFields();
        },
        //查看页
        getBrowseFields : function() {	        
	    	var rows = {
	    		xtype:"panel",//类型必须有
	            layout:'column',
	            items:[
	            	{columnWidth:1,layout: 'form',items: [projectName]},
	            	{columnWidth:1,layout: 'form',items: [projectExplain]}
	            ]
	    	}
	    	return [rows];
        },
        getStoreField : function() {
            return storeField;
        },
        getStore : function(url, pageCount) {      
            var store = new Ext.data.JsonStore({            	
                //proxy: new Ext.ux.data.PagingMemoryProxy(myDatas),
                proxy: new Ext.data.HttpProxy({
                	method: 'GET',
                    //prettyUrls: false,
                    url:url
                }),
                //reader: new Ext.data.JsonReader({
                    root : "rows",
                    totalProperty : "totalCount",
                    fields:storeField,
                //})
				listeners: {
					'load': function(_this ,  records ,  options) {							
						var request=0,deliver=0,deliverRate=0,open=0,openRate=0,
							singleOpen=0,singleOpenRate=0,
							click=0,clickRate=0,singleClick=0,singleClickRate=0,
							unsubscribe=0,unsubscribeRate=0,invalid=0,invalidRate=0,
							bounce=0,bounceRate=0,bounce=0,bounceRate=0,
							spam=0,spamRate=0,report_spam=0,report_spamRate=0;
						
						for(var i=0;i<records.length;i++) {
							var record = records[i]
							request += parseInt(record.get("request"));
							deliver += parseInt(record.get("deliver"));
							deliverRate += parseFloat(record.get("deliverRate"));
							click += parseInt(record.get("click"));
							clickRate += parseFloat(record.get("clickRate"));
							open += parseInt(record.get("open"));
							openRate += parseFloat(record.get("openRate"));
							singleOpen += parseInt(record.get("singleOpen"));
							singleOpenRate += parseFloat(record.get("singleOpenRate"));
							invalid += parseInt(record.get("invalid"));
							invalidRate += parseFloat(record.get("invalidRate"));
							bounce += parseInt(record.get("bounce"));
							bounceRate += parseFloat(record.get("bounceRate"));
							spam += parseInt(record.get("spam"));
							spamRate += parseFloat(record.get("spamRate"));
							report_spam += parseInt(record.get("report_spam"));
							report_spamRate += parseFloat(record.get("report_spamRate"));
							unsubscribe += parseInt(record.get("unsubscribe"));
							unsubscribeRate += parseFloat(record.get("unsubscribeRate"));
						}
						
						var toolbar = Ext.getCmp("staTtoolbar");
						if(!!toolbar) {
							toolbar.removeAll();
							var items = [
								{text:'请求<br>'+request+'', handler:function(){
								}},
								'-',
								{text:'发送<br>'+deliver+'<br>'+(deliver/request*100).toFixed(2)+'%', handler:function(){	        	
								}},
								'-',
								{text:'无效<br>'+invalid+'<br>'+(invalid/request*100).toFixed(2)+'%', handler:function(){	        	
								}},
								'-',
								{text:'软退信<br>'+bounce+'<br>'+(bounce/request*100).toFixed(2)+'%', handler:function(){	        	
								}},
								'-',
								{text:'垃圾邮件<br>'+spam+'<br>'+(spam/request*100).toFixed(2)+'%', handler:function(){	        	
								}},
								'-',
								{text:'垃圾邮件举报<br>'+report_spam+'<br>'+(report_spam/request*100).toFixed(2)+'%', handler:function(){	        	
								}}
							]
							if(toolbar.items.length < 6) {
								toolbar.add(items);
								toolbar.doLayout();
							}
						}
						
						var toolbar = Ext.getCmp("trackToolbar");
						if(!!toolbar) {
							toolbar.removeAll();
							var items = [
								{text:'请求<br>'+request+'', handler:function(){
								}},
								'-',
								{text:'发送<br>'+deliver+'<br>'+(deliver/request*100).toFixed(2)+'%', handler:function(){	        	
								}},
								'-',
								{text:'打开<br>'+open+'<br>'+(open/request*100).toFixed(2)+'%', handler:function(){	        	
								}},
								'-',							
								{text:'点击<br>'+click+'<br>'+(click/request*100).toFixed(2)+'%', handler:function(){	        	
								}},
								'-',								
								{text:'取消订阅<br>'+unsubscribe+'<br>'+(unsubscribe/request*100).toFixed(2)+'%', handler:function(){	        	
								}}
							]
							if(toolbar.items.length < 4) {
								toolbar.add(items);
								toolbar.doLayout();
							}
						}
					}
				}
				
            });
            //store.load({params:{start:0, limit:pageCount}});
            return store;
        },
       
        getGridColumns: function() {
            return gridColums;
        },
		getTrackGridColumns : function() {
			return gridColumsTrack;
		}
    }
})();