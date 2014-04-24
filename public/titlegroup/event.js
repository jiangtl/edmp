Ext.namespace("event.titlegroup");
event.titlegroup = (function(){
	var f_form = system.factory.Form;
	var fields = field.titlegroup;
	var optionTitleGroupFn = function(option, grid) {
		var record = [],
			url = "/titlegroup/create/";			

		if(option == "view") {
			record = grid.getSelectionModel().getSelected();			
			url = "/titlegroup/update/?id=" + record.get('id');
		}

    	var formConfig = {
    	    id:"templateInfoForm",
    	    height : 300,
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
                name:record.get('name')          
            };
			//赋值
			for(var name in data){
				var value = data[name];
				var field = formObj.findField(name);
				if(field)
					field.setValue(value);
			}

			var titleListField = record.get("title_list");
			formObj.items.each(function(item, index, length){				
				if(item.name == "title_list") {
					//标题赋值
					if(!Ext.isEmpty(titleListField[index-1])) {
						item.setValue(titleListField[index-1]);
					}
				}
			})
			
			//默认为只读
            //setFieldsReadOnly(userInfoForm, true);
		}
    	
		var win = new Ext.Window({
    		title:"添加标题组",
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
			optionTitleGroupFn("add", grid);
		},
		viewTemplate : function(grid, rowIndex, e) {
			optionTitleGroupFn("view", grid, rowIndex, e);
		}
	}
})();