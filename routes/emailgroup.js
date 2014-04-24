/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-1-23
 * Time: 下午9:02
 * To change this template use File | Settings | File Templates.
 */

var EmailGroupDao = require("../dao/EmailGroupDao"),
    EmailGroup = require("../models").EmailGroup,
    util = require("../libs/util"),
    path = require('path'),
    fs = require("fs");
var loginName = "";
var _invalidData = []; //无效邮件 预加载方式
function getSplitEmails(data) {
    var arr = [];
    if(data.indexOf("\r\n")) {
        arr = data.split("\r\n");
    } else if(data.indexOf("\n")) {
        arr = data.split("\n");
    } else {
        arr = [data];
    }
    return arr;
}
(function(){
    var file = __dirname + '/../public/invalid.txt';
    fs.readFile(file, 'utf8', function(err, data){
        if(util.isEmpty(data)) {            
            return;
        }
        _invalidData = getSplitEmails(data);
    });
})()
function filterInvalidData(res) {
    var result = [];
    for(var i = 0; i < res.length; i++) {
        var email = res[i];
        if(util.isEmpty(email)) continue;
        var flag = 1;
        for (var j = 0; j < _invalidData.length; j++) {
            if(email.trim() === _invalidData[j]) {
                flag = 0;
                break;
            }
        };
        if(flag === 1) {
            result.push(email);
        }
    }
    return result;  
}

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
            name : RegExp(req.query.name, "i"),
            description : RegExp(req.query.description, "i"),
        },
        col : ""//多列加空格
    }
    if(!util.isEmpty(req.query.type)) {
        params.search.type = req.query.type;
    }
    var options = {skip: start, limit: limit, sort: {create_at: -1}};
    EmailGroupDao.getByQuery(params.search, params.col, options, function (err, emailgroups) {
        EmailGroupDao.countByQuery(params.search, function(error, count){
            res.send({
                rows : emailgroups,
                totalCount : count
            });
        })        
    });
};
exports.create = function(req, res) {
    fs.readFile(req.files['file'].path, 'utf8', function(err, data){
        var arr = [];
        if(util.isEmpty(data)) {
            console.log("file is empty!");
            return;
        }
        if(util.isEmpty(data)) {            
            return;
        }
        arr = filterInvalidData(getSplitEmails(data)); //解析数据并过滤无效邮件
        var fname = +new Date().getTime()+'.txt';        
        fs.writeFile(__dirname + '/../public/upload/'+fname, data, function(err){res.send(err);})
        var entity = req.body;
        util.apply(entity, {
            path : '/upload/' + fname,//存url可访问路径
            email_list : arr,
            num : arr.length,
            create_user : loginName,
            update_user : loginName
        })

        EmailGroupDao.create(new EmailGroup(entity),function(error){
            res.send(JSON.stringify({success:true, msg:'OK'}));
        })
    });  
    res.send(JSON.stringify({success:true, msg:'OK'}));  
    //res.redirect('/emailgroup/');
};
exports.update = function(req, res) {
    EmailGroupDao.update({name:/334/i}, {description : '已被修改'}, null, function(error){
        if(!error) {
            res.send("ok");
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
    EmailGroupDao.update({_id:{$in:arr}}, {delsign : 1},{multi:true}, function(error){
        console.log("error", error);
        if(!error) {
            res.send({success:true, msg:'OK'})
        }
    });
};
exports.check = function(req, res) {
    EmailGroupDao.countByQuery({create_user:loginName,delsign:0, name:req.query.name}, function(err, models) {
        if(models === 0) {
            res.send({success:true, msg:'OK'})
        } else {
            res.send({success:false, msg:'该记录已存在！'})
        }
    })
}
exports.getList = function(req, res) {
    EmailGroupDao.getByQuery({create_user : loginName, delsign : 0}, "_id name", {sort: {_id:-1}}, function (err, rows) {
            console.log(rows);
            res.send(rows);     
        
    });
};