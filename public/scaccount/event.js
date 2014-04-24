Ext.namespace("event.scaccount");
event.scaccount = (function(){
	var f_form = system.factory.Form;
	var fields = field.scaccount;
	var optionScAccountFn = function(option, grid) {
		var record = [],
			url = "/scaccount/create/";			

		if(option == "view") {
			record = grid.getSelectionModel().getSelected();			
			url = "/scaccount/update/?id=" + record.get('id');
		}

    	var formConfig = {
    	    id:"templateInfoForm",
    	    autoHeight : true,
    	    defaults: {
	            anchor: '95%',
	            allowBlank: false,
	            msgTarget: 'side'
	        },
    	    items:[fields.getBrowseFields()]
    	};
    	formConfig.buttons = [{
            text: '保存',
            handler: function(){
            	var fp = Ext.getCmp(formConfig.id);
                if(fp.getForm().isValid()){
                	if(option == "add") {
                		console.log(fp,fp.getForm());
                		var username = fp.getForm().findField("username").getValue();
	                	Ext.Ajax.request({
							url:"/scaccount/check/?username="+username,
							success: function(response, opts) {			            	
								var obj = Ext.decode(response.responseText);
								if(obj.success == true) {
									fp.getForm().submit({
					                    url: url,
					                    method:'post',
					                    waitMsg: '处理中...',		                    
					                    success:function(response,action) {
				                            if(action.result.msg=='OK') {
				                                Ext.MessageBox.alert("提示：", "保存成功！");
				                                grid.getStore().reload();
				                            } else {
				                                Ext.MessageBox.alert("提示：",action.result.msg);
				                            }
				                        },
				                        //提交失败的回调函数
				                        failure:function(response,action) {	                        	
				                        	Ext.Msg.alert("提示：","系统错误！");
				                        }
					                });								
								} else {									
									Ext.MessageBox.alert("提示", "账号["+username+"]已存在！");
								}
							},
							failure: function(response, opts) {
							}
						});	 
					} else {
						fp.getForm().submit({
		                    url: url,
		                    method:'post',
		                    waitMsg: '处理中...',		                    
		                    success:function(response,action) {
	                            if(action.result.msg=='OK') {
	                                Ext.MessageBox.alert("提示：", "保存成功！");
	                                grid.getStore().reload();
	                            } else {
	                                Ext.MessageBox.alert("提示：",action.result.msg);
	                            }
	                        },
	                        //提交失败的回调函数
	                        failure:function(response,action) {	                        	
	                        	Ext.Msg.alert("提示：","系统错误！");
	                        }
		                });
					}
                }
            }
        },{
            text: '关闭',
            handler: function(){
            	win.close();
            }
        }];
    	
    	//创建FORM
    	var newForm = f_form.create(formConfig);
		var formObj = newForm.getForm();
		if("view" == option) {
		    //测试数据
            var data = {
                username:record.get('username'),
                password:record.get('password'),
                from:record.get('from'),
                fromname:record.get('fromname')
            };
			//赋值
			for(var name in data){
				var value = data[name];
				var field = formObj.findField(name);
				if(field)
					field.setValue(value);
			}			
			//默认为只读
            //setFieldsReadOnly(userInfoForm, true);
		}
    	
		var win = new Ext.Window({
    		title:"添加账号",
    		layout:'fit',
    		plain: true,
    		width:500,
    		//height:500,
    		autoShow:true,
    		autoScroll:true,
    		plain:true,
    		maximizable : true,
    		items:[newForm]
    	});
    	win.show();
	}

	return {
		addTemplate : function(grid) {
			optionScAccountFn("add", grid);
		},
		viewTemplate : function(grid, rowIndex, e) {
			optionScAccountFn("view", grid, rowIndex, e);
		}
	}
})();