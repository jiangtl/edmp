/**
 * Created with JetBrains WebStorm.
 * User: jack
 * Date: 14-4-9
 * Time: 下午17:02
 * To change this template use File | Settings | File Templates.
 */

var TitleGroupDao = require("../dao/TitleGroupDao"),
    TitleGroup = require("../models").TitleGroup,
    util = require("../libs/util"),
    fs = require("fs");

exports.list = function (req, res) {
    var start = req.query.start || 0;
    var limit = req.query.limit || 10;
    var params = {
        search : {
            name : RegExp(req.query.name, "i")
        },
        col : ""//多列加空格
    }

    var options = {skip: start, limit: limit, sort: {create_at: -1}};
    TitleGroupDao.getByQuery(params.search, params.col, options, function (err, rows) {
        TitleGroupDao.countByQuery(params.search, function(error, count){
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
        create_user : "admin",
        update_user : "admin"
    })
    TitleGroupDao.create(new TitleGroup(entity),function(error){
        res.send(JSON.stringify({success:true, msg:'OK'}));
    })
    res.send(JSON.stringify({success:true, msg:'OK'}));  
};
exports.update = function(req, res) {
    TitleGroupDao.update({_id:req.query.id}, {name:req.body.name, title_list:req.body.title_list}, null, function(error){
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

    TitleGroupDao.delete({_id:{$in:arr}}, function(error){
        if(!error) {
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'删除失败'});
        }
    });
};
exports.check = function(req, res) {
    TitleGroupDao.countByQuery({name:req.query.name}, function(err, models) {
        if(models === 0) {
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'该记录已存在！'})
        }
    })
};
exports.getList = function(req, res) {
    TitleGroupDao.getByQuery({}, "_id name", {sort: {_id:1}}, function (err, rows) {
            console.log(rows);
            res.send(rows);     
        
    });
};