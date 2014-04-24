/**
 * Created with JetBrains WebStorm.
 * User: jack
 * Date: 14-4-23
 * Time: 上午9:02
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose'),
    ScStatDao = require("../dao/ScStatDao"),
    ScStat = require("../models").ScStat,
    util = require("../libs/util"),
    path = require('path'),
    fs = require("fs"),
    http = require('http'),
    https = require('https');

var loginName = "";
exports.list = function (req, res) {
    if(!req.session.loginname) {
        //res.send({"unlogin" : true});
    } else {
        loginName = req.session.loginname;
    }
    var params = {
        search : {
            date:{$gte:(req.query.stime).substr(0,10),$lte:(req.query.etime).substr(0,10)}
        },
        col : ""//多列加空格
    }
    if(!util.isEmpty(req.query.taskid)) {
        params.search["labelId"] = parseInt(req.query.taskid);
    }
    var group = {
        "key": {"date":true},
        cond: params.search,
        reduce: function(doc, out) {
            out.request += doc.request;
            out.deliver += doc.deliver;
            out.open += doc.open;
            out.click += doc.click;
            out.unsubscribe += doc.unsubscribe;
            out.bounce += doc.bounce;
            out.spam += doc.spam;
            out.report_spam += doc.report_spam;
            out.invalid += doc.invalid;
      
            out.count++;
            out.date = doc.date;
        },
        initial: {
            date : '',
            request : 0,
            deliver : 0,
            deliverRate : 0.0,
            open : 0,
            openRate : 0.0,
            click : 0,
            clickRate : 0.0,
            unsubscribe : 0,
            unsubscribeRate : 0.0,
            bounce : 0,
            bounceRate : 0.0,
            spam : 0,
            spamRate : 0.0,
            report_spam : 0,
            report_spamRate : 0.0,
            invalid : 0,
            invalidRate : 0.0,
            count : 0
        },
       finalize: function(out) {
           if(out.request == 0) return;
           out.deliverRate = (out.deliver / out.request * 100).toFixed(2);
           out.openRate  = (out.open / out.request * 100).toFixed(2);
           out.clickRate = (out.click / out.request * 100).toFixed(2);
           out.unsubscribeRate  = (out.unsubscribe / out.request * 100).toFixed(2);
           out.bounceRate = (out.bounce / out.request * 100).toFixed(2);
           out.spamRate  = (out.spam / out.request * 100).toFixed(2);
           out.report_spamRate = (out.report_spam / out.request * 100).toFixed(2);
           out.invalidRate  = (out.invalid / out.request * 100).toFixed(2);
       }
    };

    ScStat.collection.group(group.key, group.cond, group.initial, group.reduce, group.finalize, true, function(err, results) {
        //console.log('group results %j', results);
        res.send({
            rows : results
        });
    });



    //var options = {skip: start, limit: limit, sort: {date: -1}};
    //ScStatDao.getByQuery(params.search, params.col, options, function (err, rows) {
    //    ScStatDao.countByQuery(params.search, function(error, count){
    //        res.send({
    //            rows : rows,
    //            totalCount : count
    //        });
    //    })        
    //});
};


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

