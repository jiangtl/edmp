Ext.namespace("_event.template");
_event.template = (function(){
	var f_form = system.factory.Form;
	var fields = field.template;
	var optionTemplateFn = function(option, grid) {
		var record = [],
			url = "/template/create/";			

		if(option == "view") {
			record = grid.getSelectionModel().getSelected();			
			url = "/template/update/?id=" + record.get('id');
		}

    	var formConfig = {
    	    id:"templateInfoForm",
    	    height : 260,
    	    defaults: {
	            anchor: '95%',
	            allowBlank: false,
	            msgTarget: 'side'
	        },
    	    items:[fields.getBrowseFields()]
    	};
    	formConfig.buttons = [{
        	text : '预览',
        	handler : function() {
        		var formObj = Ext.getCmp(formConfig.id).getForm();
				var content = encodeURI(formObj.findField("html").getValue());
				openPostWindow("/template/preview/?c=template&fun=view",content,"预览");
        	}
        },{
        	text : '发送测试邮件',
        	handler : function() {
        		var formObj = Ext.getCmp(formConfig.id).getForm();	
				var html = formObj.findField("html").getValue();					
				sendTestForm(html);
	    	}
        },{
            text: '保存',
            handler: function(){
            	var fp = Ext.getCmp(formConfig.id);
                if(fp.getForm().isValid()){
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
                html:record.get('html'),
                deadline:record.get('deadline')
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
    		title:"添加模版",
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

	function sendTestForm(content) {
		var receiver = {
			xtype : 'textfield',
			fieldLabel : '收件人Email',
			name : 'receiver',
			anchor :'95%',
			regex : /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
			regexText : '请输入收件人邮件地址'
		};
		var html = {xtype:'hidden', name:'html',value:content};

		var formConfig = {
    	    id:"sendTestForm",
    	    height : 170,
    	    defaults: {
	            anchor: '95%',
	            allowBlank: false,
	            msgTarget: 'side'
	        },
    	    items:[receiver, html, field.scaccount.getAaccountComboBox('w1')]
    	};
    	formConfig.buttons = [{
        	text : '发送',
        	handler : function() {
        		var fp = Ext.getCmp(formConfig.id);
                if(fp.getForm().isValid()){
	                fp.getForm().submit({
	                    url: '/task/sendtest',
	                    method:'post',
	                    waitMsg: '处理中...',		                    
	                    success:function(response,action) {
                            if(action.result.msg=='OK') {
                                Ext.MessageBox.alert("提示：", "发送成功！");
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
        },{
            text: '关闭',
            handler: function(){
            	win1.close();
            }
        }]
        //创建FORM
    	var newForm = f_form.create(formConfig);
    	var win1 = new Ext.Window({
    		title:"发送测试邮件",
    		layout:'fit',
    		plain: true,
    		width:500,
    		//height:500,
    		autoShow:true,
    		autoScroll:true,
    		plain:true,
    		maximizable : true,
            closeAction : 'close',
    		items:[newForm]
    	});
    	win1.show();
	}

	return {
		addTemplate : function(grid) {
			optionTemplateFn("add", grid);
		},
		viewTemplate : function(grid, rowIndex, e) {
			optionTemplateFn("view", grid, rowIndex, e);
		}
	}
})();