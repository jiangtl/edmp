/**
 * Created with JetBrains WebStorm.
 * User: jack
 * Date: 14-4-9
 * Time: 上午9:02
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose'),
    ScLogDao = require("../dao/ScLogDao"),
    ScLog = require("../models").ScLog,
    ScStat = require("../models").ScStat,
    util = require("../libs/util"),
    path = require('path'),
    fs = require("fs"),
    http = require('http'),
    https = require('https');

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
        var kv = arr[i].split("=");
        if(kv[0] == "labelId" || kv[0] == "timestamp") {
            obj[arr[i].split("=")[0]] = parseInt(arr[i].split("=")[1]);
        } {
            obj[arr[i].split("=")[0]] = arr[i].split("=")[1];
        }        
    }
    return obj;
}
//定时任务
setInterval(function(){
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if(hour == 1 && minute == 1 && second==0) {
        var one = 1000 * 60 * 60 * 24 * 1;
        var yesterday = new Date();
        yesterday.setTime(date.getTime() - one);
        var fileName = yesterday.format("yyyy-MM-dd");        
        var options = {
            host: "www.kaoshichong.com",
            port: 80,
            path: "/upload/sclog/"+yesterday.format("yyyyMMdd")+".txt",
            method: 'GET'
        };
        console.log(options.host+options.path);
        var req = http.get(options, function (res) {
        var txt = "";
        res.on('data', function (data) {
            txt += data;
            }).on('end', function () {
                try{
                    if(!txt) return;    

                    //ScLogDao.delete({'date':fileName}, function(models) {
                    //    console.log(models);
                    // })
                    ScLogDao.countByQuery({'date':fileName}, function (err, models) {                        
                        if(models === 0) {
                            var arrData = txt.split("\n");
                            var json = {};
                            var obj = {
                                count : 0
                            }
                            for(var i=0, len=arrData.length; i<len; i++) {
                                if(!arrData[i]) continue;
                                json = getJsUrl(arrData[i]);
                                json.date = fileName;                                
                                if(parseInt(json.labelId) < 9000000){
                                     obj.count++;
                                    continue;
                                }                             
                                ScLogDao.create(new ScLog(json),function(error){
                                    obj.count++;
                                    if(obj.count == len-1) {
                                        console.log("stat run");
                                        saveStat(fileName);
                                    }
                                })                                
                            }
                            console.log(fileName+".json");
                            util.writeFile(fileName+".json", JSON.stringify(json));   
                        } else {
                            console.log(fileName,'已存在');
                        }
                    });

                } catch(e) {
                    throw e;
                }
            })
        })
        req.end();
    }
},1000);


function saveStat(date) {
    var group = {
        "key": {"labelId":true},
        cond: {"date": date},
        reduce: function(doc, out) {
            switch(doc.event) {
                case 'request' : out.request += doc.recipientSize; break;
                case 'deliver' : out.deliver++; break;
                case 'open' : out.open++; break;
                case 'click' : out.click++; break;
                case 'unsubscribe' : out.unsubscribe++; break;
                case 'bounce' : out.bounce++; break;
                case 'spam' : out.spam++; break;
                case 'report_spam' : out.report_spam++; break;
                case 'invalid' : out.invalid++; break;
            }
            out.count++;
        },
        initial: {
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

    ScLog.collection.group(group.key, group.cond, group.initial, group.reduce, group.finalize, true, function(err, results) {
        //console.log('group results %j', results);
        ScStat.remove({ date: date }, function (err) {
            if (err) {
                console.log(doc);
                return;
            }
            for(var i=0; i<results.length; i++) {
                var json = util.apply(results[i],{date : date});
                var statModel = new ScStat(json)
                statModel.save();
            }
        });
    });
}