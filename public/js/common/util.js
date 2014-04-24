Wit = {
	/**
     * The version of the framework
     * @type String
     */
    version : '1.2',
	pubDate : '2013-4-25',
	addEvent : null,
	delEvent : null
}
/**
 * 添加/删除事件，兼容各浏览器
 * @method addEvent
 * @param {Object} DOM元素
 * @param {String} 事件句柄
 * @param {Function} 自定义监听函数
 */
if(typeof window.addEventListener === 'function') {
	Wit.addEvent = function(element, type, listener){
		element.addEventListener(type, listener, false );			
	}
	Wit.delEvent = function(element, type, handler){			
		element.removeEventListener(type, handler, false );
	}
} else if(typeof window.attachEvent === 'function') {
	Wit.addEvent = function(element, type, listener){
		element.attachEvent('on' + type, listener);
	}
	Wit.delEvent = function(element, type, handler){			
		element.detachEvent('on' + type, handler);
	}
} else {//更早版本的浏览器
	Wit.addEvent = function(element, type, listener){
		element["on" + type] = listener;
	}
	Wit.delEvent = function(element, type, handler){			
		element["on" + type] = null;
	}
}	
/**
 * 设置cookie
 * @param {} name
 * @param {} value
 * @param {} days
 * add by jiangtl 2011-4-1
 */
function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else {
		expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/";
}
/**
 * 读取cookie
 * @param {} name
 * @return {}
 * add by jiangtl 2011-4-1
 */
function readCookie(name) {
	var nameEQ = name + "=",
	ca = document.cookie.split(';'),
	i,
	c,
	len = ca.length;
	for (i = 0; i < len; i++) {
		c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameEQ) == 0) {
			return c.substring(nameEQ.length, c.length);
		}
	}
	return null;
}

/**
 * Ajax 操作失败通用方法
 * @param {} response
 * @param {} opts
 * add by jiangtl 2011-4-1
 */
function failureFn(response, opts) {
	Ext.MessageBox.alert('操作失败', '请重新再试！');
}
/**
 * 根据ID身份证取生日日期和性别
 * @param {} v
 * add by jiangtl 2012-7-2
 */
function getIDcardDateValue(v) {
	var year = "",
	month = "",
	day = "",
	sex = "";
	if (v.length == 18) {
		//21010119860123456X
		year = v.substr(6, 4);
		month = v.substr(10, 2);
		day = v.substr(12, 2);
		sex = (parseInt(v.substr(16, 1)) % 2 == 0 ? '女' : '男');
	} else if (v.length == 15) {
		//212505650211199
		year = "19" + v.substr(6, 2);
		month = v.substr(8, 2);
		day = v.substr(10, 2);
		sex = (parseInt(v.substr(14, 1)) % 2 == 0 ? '女' : '男');
	}
	return [year, month, day, sex];
}

function openPostWindow(url, data, name) {
	var tempForm = document.createElement("form");
	tempForm.id = "tempForm1";
	tempForm.method = "post";
	tempForm.action = url;
	tempForm.target = name;

	var hideInput = document.createElement("input");
	hideInput.type = "hidden";
	hideInput.name = "content";
	hideInput.value = data;
	tempForm.appendChild(hideInput);

	//监听事件的方法        打开页面window.open(name);
	Wit.addEvent(tempForm, "onsubmit", function () {
		window.open(name);
	})
	//tempForm.addEventListener("onsubmit", function () {
	//	window.open(name);
	//});
	document.body.appendChild(tempForm);

	tempForm.submit();
	document.body.removeChild(tempForm);

}
function parseUrl(){
    var params = {};
    var loc = String(document.location);
    if (loc.indexOf("?") > 0) 
        loc = loc.substr(loc.indexOf('?') + 1);
    else 
        return "";
    var pieces = loc.split('&');
    params.keys = [];
    for (var i = 0; i < pieces.length; i += 1) {
        var keyVal = pieces[i].split('=');
        params[keyVal[0]] = decodeURIComponent(keyVal[1]);
        params.keys.push(keyVal[0]);
    }
    return params;
}