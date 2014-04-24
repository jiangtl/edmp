Ext.namespace("events.emailgroup");
events.emailgroup = (function(){
	var fields = field.emailgroup;
	var impEmailgroup = function(grid) {
		var url = "/emailgroup/create/?type=1";
		var name = fields.getField("name");
    	var description = fields.getField("description");
		var file = {
            xtype: 'fileuploadfield',
            emptyText: '选择一个文本文件',
            fieldLabel: '文件',
            name: 'file',
            buttonText: '',
            buttonCfg: {
                iconCls: 'icon-upload'
            },
            regex : /(.txt)$/,
    		regexText:"只能导入文本文件"
        }
		var fp = new Ext.FormPanel({
	        fileUpload: true,
	        width: 500,
	        frame: true,
	        autoHeight: true,
	        bodyStyle: 'padding: 10px 10px 0 10px;',
	        //enctype:'multipart/form-data;charset=utf-8',
	        labelWidth: 80,
	        defaults: {
	            anchor: '95%',
	            allowBlank: false,
	            msgTarget: 'side'
	        },
	        items: [name, description, file],
	        buttons: [{
	            text: '保存',
	            handler: function(){				
					var name = fp.getForm().findField("name").getValue();
						Ext.Ajax.request({
							url:"/emailgroup/check/?name="+name,
							success: function(response, opts) {			            	
								var obj = Ext.decode(response.responseText);
								if(obj.success == true) {
									if(fp.getForm().isValid()){
										fp.getForm().submit({
											url: url,
											method:'post',
											waitMsg: '处理中...',		                    
											success:function(response,action) {
												if(action.result.msg=='OK') {
													win.close();
													Ext.MessageBox.alert("提示：","添加成功！");
													grid.getStore().reload();
												} else {
													Ext.MessageBox.alert("提示：",action.result.msg);
												}
											},
											//提交失败的回调函数
											failure:function(response,action) {
												console.log(response,action);
												Ext.Msg.alert("提示：","系统错误！");
											}
										});
									}									
								} else {									
									Ext.MessageBox.alert("提示", "邮件组["+name+"]已存在！");
								}
							},
							failure: function(response, opts) {
							}
						});	 
	            }
	        },{
	            text: '关闭',
	            handler: function(){
	                //fp.getForm().reset();
	            	win.close();
	            }
	        }]
	    });
    	
		var win = new Ext.Window({
    		title:"信息导入",
    		layout:'fit',
    		plain: true,
    		width:500,
    		//height:500,
    		autoShow:true,
    		autoScroll:true,
    		plain:true,
    		maximizable : true,
    		items:[fp]
    	});
    	win.show();
	}
	return {
		importTxt : impEmailgroup
	}
})()