Ext.namespace("event.scaccount");
event.scaccount = (function(){
	var f_form = system.factory.Form;
	var fields = field.scaccount;
	var optionScAccountFn = function(option, grid) {
		var record = [],
			url = "/user/create/";			

		if(option == "view") {
			record = grid.getSelectionModel().getSelected();			
			url = "/user/update/?id=" + record.get('id');
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
                		var login_name = fp.getForm().findField("login_name").getValue();
	                	Ext.Ajax.request({
							url:"/user/check/?login_name="+login_name,
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
									Ext.MessageBox.alert("提示", "账号["+login_name+"]已存在！");
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
            	name:record.get('name'),
                login_name:record.get('login_name'),
                password:record.get('password'),
                email:record.get('email'),
                company:record.get('company'),
                phone:record.get('phone'),
                sex:record.get('sex'),
                address:record.get('address')//,
                //account:record.get('account'),
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
            /*
            var accountListField = record.get("accounts");
            var accountIndex = 0;
			formObj.items.each(function(item, index, length){
				if(item.name == "accounts") {
					//账号赋值
					if(!Ext.isEmpty(accountListField[accountIndex].name)) {
						item.setValue(accountListField[accountIndex++].name);
					}
				}
			})
			accountIndex=0;
			formObj.items.each(function(item, index, length){
				if(item.name == "accountpwd") {
					//账号赋值
					if(!Ext.isEmpty(accountListField[accountIndex].password)) {
						item.setValue(accountListField[accountIndex++].password);
					}
				}
			})
			accountIndex=0;
			formObj.items.each(function(item, index, length){
				if(item.name == "from") {
					//账号赋值
					if(!Ext.isEmpty(accountListField[accountIndex].from)) {
						item.setValue(accountListField[accountIndex++].from);
					}
				}
			})
			accountIndex=0;
			formObj.items.each(function(item, index, length){
				if(item.name == "fromname") {
					//账号赋值
					if(!Ext.isEmpty(accountListField[accountIndex].fromname)) {
						item.setValue(accountListField[accountIndex++].fromname);
					}
				}
			})
			*/
		}
    	
		var win = new Ext.Window({
    		title:"添加用户",
    		layout:'fit',
    		plain: true,
    		width:600,
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