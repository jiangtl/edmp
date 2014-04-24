Ext.namespace("event.task");
event.task = (function(){
	var f_form = system.factory.Form;
	var fields = field.task;
	var optionTaskFn = function(option, grid) {
		var record = [],
			url = "/task/create/";			
        var tplValue = "",
            scaccountValue = "",
            egroupValue = "",
            teroupValue = "";
		if(option == "view") {
			record = grid.getSelectionModel().getSelected();			
			url = "/task/update/?id=" + record.get('id');
            tplValue = record.get('template');
            scaccountValue = record.get('scaccount');
            egroupValue = record.get('email_group');
            teroupValue = record.get('title');
		}

    	var formConfig = {
    	    id:"taskInfoForm",
    	    height : 320,
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
                name:record.get('name'),
                template:record.get('template'),
                scaccount:record.get('scaccount'),
                email_group:record.get('email_group'),
                title:record.get('title')
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
    		title:"添加任务",
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

    function runTask(grid) {
        var records = grid.getSelectionModel().getSelections();
        var ids = "";
        for(var i=0;i<records.length;i++) {
            //if(records[i].data.status == 1) {
            //    Ext.MessageBox.alert("提示", "存在发送中任务，请重新选择！");
            //    return;
            //}
            if(ids == "") {
                ids = records[i].data.id;
            } else {
                ids += ","+records[i].data.id;
            }               
        }
        if(records.length>0) {             
        Ext.MessageBox.YESNO = {yes:'确认',no:'取消'}; 
        Ext.MessageBox.confirm("提示","确定这个操作吗？",function (btn){
            if (btn=="yes") {
                Ext.Ajax.request({
                    url:'/task/send/?id='+ids,
                    success: function(response, opts) {                         
                        var obj = Ext.decode(response.responseText);
                        if(obj.msg == 'OK') {
                            Ext.MessageBox.alert("提示", "发送成功！");
                            grid.getStore().reload();
                        } else {
                            Ext.MessageBox.alert("提示", obj.msg);
                        }
                    },
                    failure: function(response, opts) {
                    }
                }); 
            }
         },this);
        } else {
        Ext.MessageBox.alert("提示","请选择一条记录！");
        } 
    }

	return {
		addTask : function(grid) {
			optionTaskFn("add", grid);
		},
		viewTask : function(grid, rowIndex, e) {
			optionTaskFn("view", grid, rowIndex, e);
		},
        runTask : runTask
	}
})();