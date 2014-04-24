Ext.namespace('Ext.ux.form');

Ext.ux.form.IconCombo = Ext.extend(Ext.form.ComboBox, {
    initComponent:function() {
        var css = '.ux-icon-combo-icon {background-repeat: no-repeat;background-position: 0 50%;width: 18px;height: 14px;}'
        + '.ux-icon-combo-input {padding-left: 25px;}'
        + '.x-form-field-wrap .ux-icon-combo-icon {top: 4px;left: 5px;}'
        + '.ux-icon-combo-item {background-repeat: no-repeat ! important;background-position: 3px 50% ! important;padding-left: 24px ! important;}'
        + ".ux-flag-br {background-image:url(img/186.gif) !important;}"
        + ".ux-flag-us {background-image:url(img/186.gif) !important;}"
        ;

        Ext.util.CSS.createStyleSheet(css, this._cssId);
        
        Ext.apply(this, {
            tpl:  '<tpl for=".">'
                + '<div class="x-combo-list-item ux-icon-combo-item '
                + '{' + this.iconClsField + '}">'
                + '{' + this.displayField + '}'
                + '</div></tpl>'
        });

        Ext.ux.form.IconCombo.superclass.initComponent.apply(this, arguments);

    } // 初始化控件

    ,onRender:function(ct, position) {
        // 回调父组件onrender
        Ext.ux.form.IconCombo.superclass.onRender.apply(this, arguments);

        // adjust styles
        this.wrap.applyStyles({position:'relative'});
        this.el.addClass('ux-icon-combo-input');

        // 给icon加div
        this.icon = Ext.DomHelper.append(this.el.up('div.x-form-field-wrap'), {
            tag: 'div', style:'position:absolute'
        });
    } // onRender函数

    ,afterRender:function() {
        Ext.ux.form.IconCombo.superclass.afterRender.apply(this, arguments);
        if(undefined !== this.value) {
            this.setValue(this.value);
        }
    } // afterRender函数
    ,setIconCls:function() {
        var rec = this.store.query(this.valueField, this.getValue()).itemAt(0);
        if(rec && this.icon) {
            this.icon.className = 'ux-icon-combo-icon ' + rec.get(this.iconClsField);
        }
    } //函数样式

    ,setValue: function(value) {
        Ext.ux.form.IconCombo.superclass.setValue.call(this, value);
        this.setIconCls();
    } // 设置值

    ,_cssId : 'ux-IconCombo-css'

});

// 注册xtype
Ext.reg('iconcombo', Ext.ux.form.IconCombo);