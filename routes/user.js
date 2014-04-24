/**
 * Created with JetBrains WebStorm.
 * User: jack
 * Date: 14-4-9
 * Time: 上午9:02
 * To change this template use File | Settings | File Templates.
 */

var UserDao = require("../dao/UserDao"),
    User = require("../models").User,
    util = require("../libs/util"),
    path = require('path'),
    fs = require("fs");
var loginName = "";
exports.list = function (req, res) {
    if(!req.session.loginname) {
        res.send({"unlogin" : true});
    } else {
        loginName = req.session.loginname;
    }
    var start = req.query.start || 0;
    var limit = req.query.limit || 10;
    var params = {
        search : {
            delsign : 0,
            name : RegExp(req.query.name, "i"),
            login_name : RegExp(req.query.login_name, "i"),
        },
        col : ""//多列加空格
    }

    var options = {skip: start, limit: limit, sort: {create_at: -1}};
    UserDao.getByQuery(params.search, params.col, options, function (err, rows) {
        UserDao.countByQuery(params.search, function(error, count){
            res.send({
                rows : rows,
                totalCount : count
            });
        })        
    });
};

exports.create = function(req, res) {
    var entity = req.body;
    util.apply(entity, {
        create_user : loginName,
        update_user : loginName
    })
    /*
    var accounts = entity.accounts;
    var pwds = entity.accountpwd;    
    for(var i=0; i<accounts.length;i++) {
        entity.account.push({
            name : accounts[i],
            password : pwds[i],
            from : entity.from[i],
            fromname : entity.fromname[i]
        })
    }
    console.log(entity);
    */
    UserDao.create(new User(entity),function(error){
        res.send(JSON.stringify({success:true, msg:'OK'}));
    })
    res.send(JSON.stringify({success:true, msg:'OK'}));  
};
exports.update = function(req, res) {
    var entity = req.body;
    util.apply(entity, {
        update_user : loginName,
        update_at : new Date()
    })
    UserDao.update({_id:req.query.id}, entity, null, function(error){
        if(!error) {
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'更新失败'});
        }
    });
};
exports.delete = function(req, res) {    
    var ids = req.query.id;
    var arr = [];
    if(ids.indexOf(",")) {
        arr = ids.split(",");
    } else {
        arr.push(ids);
    }

    UserDao.update({_id:{$in:arr}}, {delsign : 1},{multi:true}, function(error){
        if(!error) {
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'删除失败'});
        }
    });
};
exports.check = function(req, res) {
    UserDao.countByQuery({delsign:0,login_name:req.query.login_name}, function(err, models) {
        if(models === 0) {
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'该记录已存在！'})
        }
    })
};
exports.getList = function(req, res) {
    UserDao.getByQuery({delsign : 0}, "_id account", {sort: {_id:1}}, function (err, rows) {
       
            console.log(rows);
            res.send(rows);     
        
    });
};