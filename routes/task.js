/**
 * Created with JetBrains WebStorm.
 * User: jack
 * Date: 14-4-15
 * Time: 下午15:00
 * To change this template use File | Settings | File Templates.
 */
 var TaskDao = require("../dao/TaskDao"),
    ScDao = require("../dao/ScDao"),
    TitleDao = require("../dao/TitleDao"),
    EmailGroupDao = require("../dao/EmailGroupDao"),
    ScAccountDao = require("../dao/ScAccountDao"),
    TemplateDao = require("../dao/TemplateDao"),
    Task = require("../models").Task,
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
            name : RegExp(req.query.name, "i")
        },
        col : ""//多列加空格
    }
    var options = {skip: start, limit: limit, sort: {create_at: -1}};
    TaskDao.getByQuery(params.search, params.col, options, function (err, rows) {
        TaskDao.countByQuery(params.search, function(error, count){
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

    var options = {limit: 1, sort: {labelId: -1}};
    TaskDao.getByQuery({}, "labelId", options, function (err, row) {
        console.log(row[0]);
        if(row && row[0].labelId) {
            entity.labelId = row[0].labelId + 1;
        }
        console.log(entity);
        TaskDao.create(new Task(entity),function(error){
            res.send(JSON.stringify({success:true, msg:'OK'}));
        })
    });    
    res.send(JSON.stringify({success:true, msg:'OK'}));  
};

exports.update = function(req, res) {
	var entity = req.body;
	console.log(entity);
    TaskDao.update({_id:req.query.id}, entity, null, function(error){
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

    TaskDao.update({_id:{$in:arr}}, {delsign : 1},{multi:true}, function(error){
        if(!error) {
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'删除失败'});
        }
    });
};
exports.check = function(req, res) {
    TaskDao.countByQuery({create_user:loginName,name:req.query.name}, function(err, models) {
        if(models === 0) {
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'该记录已存在！'})
        }
    })
};
exports.send = function(req, res) {    
    var ids = req.query.id;
    var arr = [];
    if(ids.indexOf(",")) {
        arr = ids.split(",");
    } else {
        arr.push(ids);
    }

    TaskDao.update({_id:{$in:arr}}, {status : 1},{multi:true}, function(error){
        if(!error) {
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'任务发送失败'});
        }
    });

    TaskDao.getByQuery({_id:{$in:arr}}, {delsign : 0}, null, function (err, rows) {
        for(var i=0; i<rows.length; i++) {
            var taskName = rows[i].name;
            var labelId = rows[i].labelId;
            var title = rows[i].title;
            var template = rows[i].template;            
            var scaccount = rows[i].scaccount;
            var email_group = rows[i].email_group;            
            EmailGroupDao.getByQuery({create_user:loginName,delsign:0,name:email_group}, "email_list", null, function (err, erows) {
                //console.log("erows", erows);
                TemplateDao.getByQuery({create_user:loginName,delsign:0,name:template}, "html", null, function (err, tplrows) {
                    //console.log("tplrows", tplrows);
                    ScAccountDao.getByQuery({create_user:loginName,delsign:0,username:scaccount}, null, null, function (err, arows) {
                        //console.log("arows", arows);
                        new ScDao({
                            task : taskName,
                            labelId : labelId,
                            account : arows[0],
                            template : tplrows[0].html,
                            title : title,
                            emails : erows[0].email_list
                        }).send();
                    });
                });
            });        
        }
    })
};
