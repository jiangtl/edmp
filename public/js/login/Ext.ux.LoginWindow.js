Ext.ux.LoginWindow = function(config) {
	Ext.apply(this, config);
	var css = "#login-logo .x-plain-body {background:#f9f9f9 url('./images/login.jpg') no-repeat;}"
			+ "#login-form  {background: "
			+ this.formBgcolor
			+ " none;}"
			+ ".ux-auth-header-icon {background: url('./images/key.gif') 0 4px no-repeat !important;}"
			+ ".ux-auth-form {padding:10px;}"
			+ ".ux-auth-login {background-image: url('./images/key.gif') !important}"
			+ ".ux-auth-close {background-image: url('"
			+ this.basePath
			+ "/close.gif') !important}";

	Ext.util.CSS.createStyleSheet(css, this._cssId);
	// 给登录窗体加事件
	this.addEvents({
				'show' : true,
				'reset' : true,
				'submit' : true,
				'submitpass' : true
			});
	Ext.ux.LoginWindow.superclass.constructor.call(this, config);

	this._logoPanel = new Ext.Panel({
				baseCls : 'x-plain',
				id : 'login-logo',
				region : 'center'
			});
	//给元素添加参数
	this.usernameId = Ext.id();
	this.passwordId = Ext.id();
	this.emailId = Ext.id();
	this.emailFieldsetId = Ext.id();
	//this.languageId = Ext.id();
	this._loginButtonId = Ext.id();
	this._resetButtonId = Ext.id();
	//this._passwordButtonId = Ext.id();
	this._WinPasswordButtonId = Ext.id();
	this._formPanel = new Ext.form.FormPanel({
				region : 'south',
				border : false,
				bodyStyle : "padding: 5px;",
				baseCls : 'x-plain',
				id : 'login-form',
				waitMsgTarget : true,
				labelWidth : 80,
				defaults : {
					width : 260
				},
				baseParams : {
					//task : 'login'
				},
				listeners : {
					'actioncomplete' : {
						fn : this.onSuccess,
						scope : this
					},
					'actionfailed' : {
						fn : this.onFailure,
						scope : this
					}
				},
				height : 80,
				items : [{
							xtype : 'textfield',
							id : this.usernameId,
							name : this.usernameField,
							value: "admin",
							fieldLabel : this.usernameLabel,
							vtype : this.usernameVtype,
							validateOnBlur : false,
							allowBlank : false
						}, {
							xtype : 'textfield',
							inputType : 'password',
							value: "admin",
							id : this.passwordId,
							name : this.passwordField,
							fieldLabel : this.passwordLabel,
							vtype : this.passwordVtype,
							validateOnBlur : false,
							allowBlank : false
						}/*,
						{
						 xtype: 'iconcombo',
						 id: this.languageId,
						 hiddenName: this.languageField,
						 fieldLabel: this.languageLabel,
						 store: new Ext.data.SimpleStore({
						   fields: ['languageCode', 'languageName', 'countryFlag'],
						   data: [['enus', '中文 - 中华人民共和国', 'ux-flag-us']]
						 }),
						 valueField: 'languageCode',
						 value: this.defaultLanguage,
						 displayField: 'languageName',
						 iconClsField: 'countryFlag',
						 triggerAction: 'all',
						 editable: false,
						 mode: 'local'
						}*/]
			});
	/*Ext.getCmp(this.languageId).on('select',
	function() {
	  this.defaultLanguage = Ext.getCmp(this.languageId).getValue(); //var lang = this.defaultLanguage;
	  this.setlanguage();
	},
	this); */
	this._formPasswordPanel = new Ext.form.FormPanel({
				bodyStyle : "padding: 5px;",
				id : 'password-form',
				waitMsgTarget : true,
				labelWidth : 50,
				autoHeight : true,
				buttonAlign : 'center',
				baseParams : {
					task : 'forgotPassword'
				},
				items : [{
							layout : 'form',
							border : false,
							items : [{
										xtype : 'fieldset',
										title : this.emailFieldset,
										id : this.emailFieldsetId,
										autoHeight : true,
										items : [{
													xtype : 'textfield',
													vtype : this.emailVtype,
													id : this.emailId,
													name : this.emailField,
													fieldLabel : this.emailLabel,
													vtype : this.emailVtype,
													validateOnBlur : false,
													anchor : '98%',
													allowBlank : false
												}]
									}]
						}],
				buttons : [{
							text : this.passwordButton,
							id : this._WinPasswordButtonId,
							width : 100,
							handler : this.Passwordsubmit,
							scope : this
						}]
			});
	var buttons = [{
				id : this._loginButtonId,
				text : this.loginButton,
				handler : this.submit,
				scale : 'medium',
				scope : this
			}];
	var keys = [{
				key : [10, 13],
				//按Enter键确定
				handler : this.submit,
				scope : this
			}];
	/*if (typeof this.passwordButton == 'string') {
	  buttons.push({
	    id: this._passwordButtonId,
	    text: this.passwordButton,      
	    handler: this.password,
	    scale: 'medium',
	    scope: this
	  });
	}*/
	if (typeof this.resetButton == 'string') {
		buttons.push({
					id : this._resetButtonId,
					text : this.resetButton,
					handler : this.reset,
					scale : 'medium',
					scope : this
				});
		keys.push({
					key : [27],
					//ESC键重置
					handler : this.reset,
					scope : this
				});
	}
	//Login窗体
	this._window = new Ext.Window({
				width : 380,
				height : 260,
				closable : false,
				resizable : false,
				draggable : true,
				modal : this.modal,
				iconCls : 'ux-auth-header-icon',
				title : this.title,
				layout : 'border',
				bodyStyle : 'padding:5px;',
				buttons : buttons,
				buttonAlign : 'center',
				keys : keys,
				plain : false,
				items : [this._logoPanel, this._formPanel]
			});
	this._windowPassword = new Ext.Window({
				width : 350,
				height : 160,
				closable : true,
				resizable : false,
				draggable : true,
				modal : this.modal,
				iconCls : 'ux-auth-header-icon',
				title : this.Passwordtitle,
				bodyStyle : 'padding:5px;',
				keys : keys,
				closeAction : 'hide',
				items : [this._formPasswordPanel]
			});
	this._window.on('show', function() {
				this.setlanguage();
				var userNameField = Ext.getCmp(this.usernameId);				
				var cookieUserName = Ext.util.Cookies.get("username");
				if(cookieUserName != null) {
					userNameField.setValue(cookieUserName);
					var passwordField = Ext.getCmp(this.passwordId);
					passwordField.focus(false, true);
				} else {
					userNameField.focus(false, true);
				}				
				this.fireEvent('show', this);
			}, this);
};

Ext.extend(Ext.ux.LoginWindow, Ext.util.Observable, {

			title : '',

			Passwordtitle : '',

			emailFieldset : '',

			waitMessage : '',

			loginButton : '',

			passwordButton : '',

			resetButton : '',

			usernameLabel : '',

			usernameField : 'login_name',

			usernameVtype : 'alphanum',

			emailLabel : '',

			emailField : 'email',

			emailVtype : 'email',

			passwordLabel : '',

			passwordField : 'password',

			passwordVtype : 'alphanum',

			languageField : 'lang',

			languageLabel : '',

			url : '/login.action',

			emailUrl : '',

			locationUrl : './index.html',

			basePath : 'img',

			winBanner : '',

			formBgcolor : '',

			method : 'post',

			modal : false,

			_cssId : 'ux-LoginWindow-css',

			_logoPanel : null,

			_formPanel : null,

			_window : null,

			_windowPassword : null,

			show : function(el) {
				this._window.show(el);
			},

			password : function(el) {
				this._windowPassword.show(el);
			},

			reset : function() {
				if (this.fireEvent('reset', this)) {
					this._formPanel.getForm().reset();
				}
			},

			defaultLanguage : 'enus ',

			setlanguage : function() {
				Ext.override(Ext.form.Field, {
							setFieldLabel : function(text) {
								if (this.rendered) {
									this.el.up('.x-form-item', 10, true)
											.child('.x-form-item-label')
											.update(text);
								} else {
									this.fieldLabel = text;
								}
							}
						});
				//if (this.defaultLanguage == 'enus') {
				this._window.setTitle('邮件发送平台-授权登录 v1.0');
				this._windowPassword.setTitle('忘记密码');
				Ext.getCmp(this._loginButtonId).setText('登录');
				//Ext.getCmp(this._passwordButtonId).setText('恢复密码');
				Ext.getCmp(this._resetButtonId).setText('重置');
				Ext.getCmp(this._WinPasswordButtonId).setText('发送');
				Ext.getCmp(this.emailId).setFieldLabel('Email');
				Ext.getCmp(this.emailFieldsetId).setTitle('输入Email');
				Ext.getCmp(this.usernameId).setFieldLabel('用户名:');
				Ext.getCmp(this.passwordId).setFieldLabel('密  码:');
				//Ext.getCmp(this.languageId).setFieldLabel('语言:');      
				this.waitMessage = '正在登录';
				//} 
			},

			submit : function() {
				var form = this._formPanel.getForm();
				if (form.isValid()) {
					//Ext.getCmp(this._loginButtonId).disable();
					//if (Ext.getCmp(this._cancelButtonId)) {
					//	Ext.getCmp(this._cancelButtonId).disable();
					//}					
					if (this.fireEvent('submit', this, form.getValues())) {
						form.submit({
							url : this.url,
							method : this.method,
							waitMsg : this.waitMessage,
							success : this.onSuccess,
							failure : this.onFailure,
							scope : this
						});
					}
				}
			},

			Passwordsubmit : function() {
				var form = this._formPasswordPanel.getForm();
				if (form.isValid()) {
					Ext.getCmp(this._WinPasswordButtonId).disable();
					if (this.fireEvent('submitpass', this, form.getValues())) {
						form.submit({
									url : this.emailUrl,
									method : this.method,
									waitMsg : this.waitMessage,
									success : this.onEmailSuccess,
									failure : this.onEmailFailure,
									scope : this
								});
					}
				}
			},

			//登录成功事件
			onSuccess : function(form, action) {
				if (action && action.result) {
					Ext.util.Cookies.set("username", form.findField("login_name").getValue());					
					//window.location = this.locationUrl;
					window.location = "/";
				}
			},

			onFailure : function(form, action) {
				Ext.MessageBox.alert("提示", "用户名或密码错误！");
				// enable buttons
				//Ext.getCmp(this._loginButtonId).enable();
				//if (Ext.getCmp(this._resetButtonId)) {
				//  Ext.getCmp(this._resetButtonId).enable();
				//}
			},

			onEmailSuccess : function(form, action) {
				if (action && action.result) {
					Ext.MessageBox.show({
								title : '消息',
								msg : '处理失败',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.INFO
							});
				}
			},

			onEmailFailure : function(form, action) {
				Ext.getCmp(this._WinPasswordButtonId).enable();
				Ext.MessageBox.show({
							title : '消息',
							msg : '处理失败',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.INFO
						});
			}
		});

Ext.onReady(function() {
			Ext.BLANK_IMAGE_URL = './ext3/resources/images/default/s.gif';
			Ext.QuickTips.init();

			new Ext.ux.LoginWindow({}).show();
		});