/**
 * Created with JetBrains WebStorm.
 * User: Jack
 * Date: 13-4-16
 * Time: 上午10:40
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');
var https = require('https');
var util = require("../libs/util");
var querystring = require('querystring');
var parseString = require('xml2js').parseString;
var email_suffix = "@member.sendcloud.org";//邮件地址列表后缀
function ScDao (config){
	config = config || {};
	util.apply(this, config);
}
/**
 *	创建邮件列表
 */
ScDao.prototype.createEmailList = function(address, callback) {
	var post_data = querystring.stringify({
		address : address,
		name : address.replace(email_suffix, ""),
		description : this.task,
		api_user:this.account.username,
		api_key:this.account.password
	});

	var options = {
		host : 'sendcloud.sohu.com',
		port : 443,
		method:'POST',
		path : '/webapi/list.create.xml',
		headers : {
			'connection':"keep-alive",
			'user-agent':"Mozilla/5.0",
			'content-type': 'application/x-www-form-urlencoded',
	        'content-length': post_data.length
		}
	};
	var req = https.request(options, function(res) {
		//console.log('STATUS: ' + res.statusCode);
		res.setEncoding('utf8');
		res.on('data', function (xml) {
			parseString(xml, function (err, response) {
				if(null !== err ){
			  		console.log(err)
			  		return;
			 	}
			 	if(response.result.message == "success") {
			 		callback(address)
			 	} else {
			 		ScDao.prototype.createEmailList(address);
			 	}
			 	
			});
		});
	});    
	// write data to request body
	req.write(post_data + "\n");
	req.end();
}

ScDao.prototype.check = function(address, callback) {
	var post_data = querystring.stringify({
		address : address,
		api_user:this.account.username,
		api_key:this.account.password
	});
	var options = {
		host : 'sendcloud.sohu.com',
		port : 443,
		method:'POST',
		path : '/webapi/list.get.xml',
		headers : {
			'connection':"keep-alive",
			'user-agent':"Mozilla/5.0",
			'content-type': 'application/x-www-form-urlencoded',
	        'content-length': post_data.length
		}
	};
	var req = https.request(options, function(res) {
		//console.log('STATUS: ' + res.statusCode);
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			var xml = chunk
			parseString(xml, function (err, response) {
				if(null !== err ){
			  		console.log(err)
			  		return;
			 	}
			 	var count = response.result.count.join();
				callback(count === "1" ? true : false, response);
			});
		});
	});    
	// write data to request body
	req.write(post_data + "\n");
	req.end();
}

ScDao.prototype.addMemberAddress = function(address, list, callback) {	
	var post_data = querystring.stringify({
		mail_list_addr : address,
		member_addr : list.join(";").replace(/\s*/g,""),
		api_user:this.account.username,
		api_key:this.account.password
	});

	var options = {
		host : 'sendcloud.sohu.com',
		port : 443,
		method:'POST',
		path : '/webapi/list_member.add.xml',
		headers : {
			'connection':"keep-alive",
			'user-agent':"Mozilla/5.0",
			'content-type': 'application/x-www-form-urlencoded',
	        'content-length': post_data.length
		}
	};
	var req = https.request(options, function(res) {
		//console.log('STATUS: ' + res.statusCode);
		res.setEncoding('utf8');
		res.on('data', function (xml) {
			parseString(xml, function (err, response) {
				if(null !== err ){
			  		console.log(err)
			  		return;
			 	}
			 	if(typeof callback == "function") {
			 		callback(address);
			 	} 
			 	//console.log(response.result);
			});
		});
	});    
	// write data to request body
	req.write(post_data + "\n");
	req.end();
}

ScDao.prototype.send = function() {
	var _this = this;
	var time = new Date().getTime();
	var address = "edmp" + time + email_suffix;
	
	_this.check(address, function(isExist, json) {
		if(isExist) {
			console.log(address,"存在.");
			//_this.addMemberAddress(address);
		} else {
			_this.createEmailList(address, function(){
				//var emails = [];//["274351128@qq.com","94492352@qq.com","7132699@qq.com","83451487@qq.com"];
				//for(var ii=0; ii<567; ii++) {
				//	emails.push("abc"+ii+"@qq.com");
				//}
				var count = Math.floor(_this.emails.length / 100) + 1;
				for(var i=0; i<count; i++) {
					var start = i * 100;
					var end = i * 100 + 100;
					if(i == count - 1) {
						end = _this.emails.length;
						var part = _this.emails.slice(start, end);
						_this.addMemberAddress(address, part, function(){
							console.log("添加完成，执行send。");
							_this.sc_send(address);
						})
					} else {
						var part = _this.emails.slice(start, end);//一百一段
						_this.addMemberAddress(address, part)
					}
				}
			});
			console.log(address,"不存在，需要创建.");
		}
	})
}

//ScDao.prototype.send();

/**
 * 调用SC发送接口
 * address : 邮件列表地址
 */
ScDao.prototype.sc_send = function(address) {
	var post_data = querystring.stringify({
		to : address,
		use_maillist : true,
		html : this.template,
		api_user:this.account.username,
		api_key:this.account.password,
		label:this.labelId,
		subject:this.title,
		from:this.account.from,
		fromname:this.account.fromname
	});
	
	var options = {
		host : 'sendcloud.sohu.com',
		port : 443,
		method:'POST',
		path : '/webapi/mail.send.json',
		headers : {
			'connection':"keep-alive",
			'user-agent':"Mozilla/5.0",
			'content-type': 'application/x-www-form-urlencoded',
	        'content-length': post_data.length
		}
	};

	var req = https.request(options, function(res) {
	  	console.log('STATUS: ' + res.statusCode);
	  	//console.log('HEADERS: ' + JSON.stringify(res.headers));
	  	res.setEncoding('utf8');
	  	res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
	  	});
	});    
	// write data to request body
	req.write(post_data + "\n");
	req.end();
}

Date.prototype.format = function (format) {
  var o = {
    "M+" : this.getMonth() + 1, //month
    "d+" : this.getDate(), //day
    "h+" : this.getHours(), //hour
    "m+" : this.getMinutes(), //minute
    "s+" : this.getSeconds(), //second
    "q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
    "S" : this.getMilliseconds() //millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}



function getJsUrl(parastr) {
	var obj = {};	
	var arr = parastr.split("&");
	for (var i = 0; i < arr.length; i++) {
		if(!arr[i]) {
			continue;
		}
		obj[arr[i].split("=")[0]] = arr[i].split("=")[1];
	}
	return obj;
}
module.exports = ScDao;