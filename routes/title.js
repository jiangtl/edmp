/**
 * Created with JetBrains WebStorm.
 * User: jack
 * Date: 14-4-17
 * Time: 下午17:02
 * To change this template use File | Settings | File Templates.
 */

var TitleDao = require("../dao/TitleDao"),
    Title = require("../models").Title,
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
            create_user : loginName,
            name : RegExp(req.query.name, "i")
        },
        col : ""//多列加空格
    }

    var options = {skip: start, limit: limit, sort: {create_at: -1}};
    TitleDao.getByQuery(params.search, params.col, options, function (err, rows) {
        TitleDao.countByQuery(params.search, function(error, count){
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
    TitleDao.create(new Title(entity),function(error){
        res.send(JSON.stringify({success:true, msg:'OK'}));
    })
    res.send(JSON.stringify({success:true, msg:'OK'}));  
};
exports.update = function(req, res) {
    TitleDao.update({_id:req.query.id}, {name:req.body.name}, null, function(error){
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

    TitleDao.delete({_id:{$in:arr}}, function(error){
        if(!error) {
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'删除失败'});
        }
    });
};
exports.check = function(req, res) {
    TitleDao.countByQuery({create_user:loginName,name:req.query.name}, function(err, models) {
        if(models === 0) {
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'该记录已存在！'})
        }
    })
};
exports.getList = function(req, res) {
    TitleDao.getByQuery({create_user:loginName}, "_id name", {sort: {_id:1}}, function (err, rows) {
            console.log(rows);
            res.send(rows);     
        
    });
};