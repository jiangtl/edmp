Ext.namespace("system.factory");
system.factory.Form = (function(){
    FormPanel = function(addConfig){       
        //模版默认配置项
        var defaultConifg = {           
            labelAlign: 'top',
            frame:true,
            plain: true,
            border:false,                       
            bodyStyle:'padding:5px 5px 0;'        
        };
                
        var allConfig = defaultConifg;
        if(addConfig)
            allConfig = Ext.apply(defaultConifg, addConfig); //合并配置项
            
        FormPanel.superclass.constructor.call(this, allConfig); 
    };
    
    Ext.extend(FormPanel, Ext.form.FormPanel, {
        initEvents : function(){
            FormPanel.superclass.initEvents.call(this);
        }
    });
    
    function setFieldsReadOnly(form, isReadOnly) {
        var items = form.getForm().items;
        for(var i=0; i<items.length;i++) {
            var field = items.itemAt(i);
            if(!isReadOnly)
                Ext.get(field.getId()).highlight('FF0000');//红色
            field.setReadOnly(isReadOnly);
        }
    }

    return {
        create : function(config) {
            return new FormPanel(config);
        }, 
        submitHandler : function(id,url,callback,method) {
            var form = Ext.getCmp(id);
            if(form.getForm().isValid()) {
            	Ext.MessageBox.YESNO = {yes:'确认',no:'取消'}; 
            	Ext.MessageBox.confirm("提示","确定这个操作吗？",function (btn){
		            //String.prototype.replaceAll = function(s1,s2){
		            //    return this.replace(new RegExp(s1,"gm"),s2);
		            //}
		            //已选定值
		            //var value = form.getForm().getValues(true);
		            //value = value.replaceAll("%2C",",");
		            //alert(value);
                	if (btn=="yes") {
						form.getForm().submit({
							url:url,
	                       	method: typeof method != "undefined" ? method : "POST",
							waitMsg: '正在处理...',
							success:function(response,action) {
	                            if(action.result.msg=='OK') {
	                                callback(action.result);
	                            } else {
	                                Ext.Msg.alert("提示：",action.result.msg);
	                            }
	                        },
	                        //提交失败的回调函数
	                        failure:function(response,action) {Ext.Msg.alert("提示：","系统错误！");}
						});						
					}              
            	},this);
            }
        },
        setFieldsReadOnly:function(form, isReadOnly){
            setFieldsReadOnly(form, isReadOnly);
        },
        ajaxHandler:function(url, callback) {
            /*Ext.Ajax.request({
                url:url,//双击事件
                method:'post',
                success:function(response,action) {
                    var data  = Ext.decode(response.responseText);
                    if(data.msg=='OK') {
                        callback(data);
                    } else {
                        Ext.Msg.alert("删除失败",data.msg);
                    }
                },
                //提交失败的回调函数
                failure:failureFn
            })*/            
        }
    }
})();