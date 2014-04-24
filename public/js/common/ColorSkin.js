ColorSkin = Ext.extend(Ext.Component, {
    
    
    itemCls : 'x-color-skin',
    
    value : null,
    
    clickEvent :'click',
    
    ctype : 'ColorSkin',

    
    allowReselect : false,

    
    colors : [
        'C7EDCC',
        '99CCFF',
        //'777777',
        //'000000',
        'B381A7',
        //'9ACD68',
        '9F82FF',
        //'AABBCC',
        //'F3A755',
        //'91CEB9',
        'C0C0C0'
        
    ],

    
    initComponent : function(){
        ColorSkin.superclass.initComponent.call(this);
        this.addEvents(
            
            'select'
        );

        if(this.handler){
            this.on('select', this.handler, this.scope, true);
        }    
    },

    
    onRender : function(container, position){
        this.autoEl = {
            tag: 'div',
            cls: this.itemCls
        };
        ColorSkin.superclass.onRender.call(this, container, position);
        var t = this.tpl || new Ext.XTemplate(
            '<tpl for="."><a href="#" class="color-{.}" hidefocus="on"><em><span style="background:#{.}" unselectable="on">&#160;</span></em></a></tpl>'
        );
        t.overwrite(this.el, this.colors);
        this.mon(this.el, this.clickEvent, this.handleClick, this, {delegate: 'a'});
        if(this.clickEvent != 'click'){
            this.mon(this.el, 'click', Ext.emptyFn, this, {delegate: 'a', preventDefault: true});
        }
    },

    
    afterRender : function(){
        ColorSkin.superclass.afterRender.call(this);
        if(this.value){
            var s = this.value;
            this.value = null;
            this.select(s, true);
        }
    },

    
    handleClick : function(e, t){
        e.preventDefault();
        if(!this.disabled){
            var c = t.className.match(/(?:^|\s)color-(.{6})(?:\s|$)/)[1];
            this.select(c.toUpperCase());
        }
    },

    
    select : function(color, suppressEvent){
        color = color.replace('#', '');
        if(color != this.value || this.allowReselect){
            var el = this.el;
            if(this.value){
                el.child('a.color-'+this.value).removeClass('x-color-palette-sel');
            }
            el.child('a.color-'+color).addClass('x-color-palette-sel');
            this.value = color;
            if(suppressEvent !== true){
                this.fireEvent('select', this, color);
            }
        }
    }

    
});
