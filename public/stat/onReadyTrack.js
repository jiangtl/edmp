Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = '/ext3/resources/images/default/s.gif';
    Ext.chart.Chart.CHART_URL = '/ext3/resources/charts.swf';
    Ext.QuickTips.init();  //开启悬停提示
    Ext.form.Field.prototype.msgTarget='qtip'; //提示显示风格
    //提示显示风格有title,qtip,side,under,around
    var fields = field.stat;
    var f_search = system.factory.Search;//搜索框面板
    var f_grid = system.factory.ListGrid;//列表框面板

    var toolbar = new Ext.Toolbar({
        id:'trackToolbar',
        region:'north',
        height:50,
        items:[]
    });
    //表格初始化
    var gridConfig = {
        height:200,
        collapsible : true, 
        collapsed:true,
        region: 'south',
        store: fields.getStore("/scstat", 365),
        columns: fields.getTrackGridColumns(),
        plugins: new Ext.ux.PanelResizer({
            minHeight: 100
        })
    };
    gridConfig.bbar=f_grid.getPageBar(gridConfig.store, 10);
    
    var fields = fields.getSearchPanelFields();
    var dataGrid = f_grid.create("", gridConfig);
    var searchPanel = f_search.create(fields , dataGrid, {id:'searchStat',region:'north',height:80});
    //cruudate
    var cdate = new Date();
    var edate = new Date(cdate.getTime() - 7*24*60*60*1000);
    searchPanel.getForm().findField("dateScope").setValue('7');
    searchPanel.getForm().findField("stime").setValue(edate.format('Y-m-d'));
    searchPanel.getForm().findField("etime").setValue(cdate.format('Y-m-d'));
    
    var chartPanel = new Ext.Panel({		
        iconCls:'chart',
        frame:true,
        region:'center',
        layout:'fit',
        items: {
            id:"statchart",
            xtype: 'columnchart',
            store: dataGrid.getStore(),
            xField: 'date',
            yAxis: new Ext.chart.NumericAxis({
                labelRenderer : Ext.util.Format.numberRenderer('0,0')
            }),
            tipRenderer : function(chart, record, index, series){
                switch(series.yField) {
                case 'open' : 
                    return record.data.open + ' 打开';
                    break;
                case 'click' : 
                    return record.data.click + ' 点击';
                    break;   
                case 'unsubscribe' :
                    return record.data.unsubscribe + ' 取消订阅';
                    break;               
                }
            },
            chartStyle: {
                padding: 10,
                animationEnabled: true,
                font: {name: 'Tahoma', color: 0x444444, size: 11},
                dataTip: {
                    padding: 5,
                    border: {
                        color: 0x99bbe8,
                        size:1
                    },
                    background: {
                        color: 0xDAE7F6,
                        alpha: .9
                    },
                    font: {
                        name: 'Tahoma',
                        color: 0x15428B,
                        size: 10,
                        bold: true
                    }
                },
                xAxis: {
                    color: 0x69aBc8,
                    majorTicks: {color: 0x69aBc8, length: 4},
                    minorTicks: {color: 0x69aBc8, length: 2},
                    majorGridLines: {size: 1, color: 0xeeeeee}
                },
                yAxis: {
                    color: 0x69aBc8,
                    majorTicks: {color: 0x69aBc8, length: 4},
                    minorTicks: {color: 0x69aBc8, length: 2},
                    majorGridLines: {size: 1, color: 0xdfe8f6}
                }
            },
            series: [{
                type:'line',
                displayName: '打开',
                yField: 'open',
                style: {
                    color: 0x00FF00
                }
            },{
                type:'line',
                displayName: '点击',
                yField: 'click',
                style: {
                    color: 0xFCD202
                }
            },{
                type:'line',
                displayName: '取消订阅',
                yField: 'unsubscribe',
                style: {
                    color: 0xCD0D74
                }
            }]
        }
    });

    var panel = new Ext.Panel({
    	region			 :'center',
    	border			 : false,
    	layout			 : 'border',
    	bodyStyle		 :'padding:1px;background:#DFE8F6',
    	items			 :[searchPanel, chartPanel, dataGrid]
    });
	
	searchPanel.buttons[0].fireEvent("click",this);  
        
	var viewport = new Ext.Viewport({
        layout:'border',        
		defaults: {
            scollapsible: true
        },
        items:[toolbar, panel]
    });  
    viewport.doLayout();
});


