/**
 * Created with JetBrains WebStorm.
 * User: jack
 * Date: 14-4-9
 * Time: 上午9:02
 * To change this template use File | Settings | File Templates.
 */

var ScAccountDao = require("../dao/ScAccountDao"),
    ScAccount = require("../models").ScAccount,
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
            create_user : loginName,
            username : RegExp(req.query.username, "i")
        },
        col : ""//多列加空格
    }

    var options = {skip: start, limit: limit, sort: {create_at: -1}};
    ScAccountDao.getByQuery(params.search, params.col, options, function (err, rows) {
        ScAccountDao.countByQuery(params.search, function(error, count){
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
    ScAccountDao.create(new ScAccount(entity),function(error){
        res.send(JSON.stringify({success:true, msg:'OK'}));
    })
    res.send(JSON.stringify({success:true, msg:'OK'}));  
};
exports.update = function(req, res) {
    var entity = req.body;
    ScAccountDao.update({_id:req.query.id}, entity, null, function(error){
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

    ScAccountDao.update({_id:{$in:arr}}, {delsign : 1},{multi:true}, function(error){
        if(!error) {
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'删除失败'});
        }
    });
};
exports.check = function(req, res) {
    ScAccountDao.countByQuery({create_user:loginName,username:req.query.username}, function(err, models) {
        if(models === 0) {
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'该记录已存在！'})
        }
    })
};
exports.getList = function(req, res) {
    ScAccountDao.getByQuery({create_user:loginName,delsign : 0}, "_id username", {sort: {username:1}}, function (err, rows) {
        res.send(rows);
    });
};