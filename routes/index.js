/*
 * GET home page.
 */


var path = require('path');
exports.index = function (req, res) {

//    var jarrick = new Users({name:'Jarrick' + Math.random() * 1000, sex:'0', phone:'12345678901',
//        address:{city:'dalian', 'street':'xigang', test:'test'}});
//    jarrick.save(function (data) {
//        console.log(data);
//    });

//    Users.getById('51037e2a8a75b31c53000001');
//    Users.getByName('Jarrick678.9289640728384');
	if(req.session.loginname && req.session.loginname!==''){
		console.log(req.session.loginname);
		//需要判断下是否已经登录
		res.render('index', {
		    loginname : req.session.loginname
		});
	}else{
		//读取登录页面，要求登录
		var html = path.normalize(__dirname + '/../public/login.html');
    	res.sendfile(html);
	}


    //var html = path.normalize(__dirname + '/../public/index.html');
    //res.sendfile(html);
//    res.render('index', { title:'NJBlog.' });
};

exports.getLoginUser = function (req, res) {
    res.json(req.session["user"] || {});
};
