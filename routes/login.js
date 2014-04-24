/**
 * Created with JetBrains WebStorm.
 * User: jack
 * Date: 14-4-18
 * Time: 下午13:02
 * To change this template use File | Settings | File Templates.
 */

var LoginDao = require("../dao/LoginDao"),
    util = require("../libs/util"),
    fs = require("fs");


exports.check = function(req, res) {
	var entity = req.body;
	console.log(entity);
    LoginDao.countByQuery(entity, function(err, models) {
        if(models > 0) {
        	req.session.loginname = entity.login_name;
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'不存在'})
        }
    })
};
exports.logout = function(req, res) {
	delete req.session.loginname;
    res.redirect('/');
}