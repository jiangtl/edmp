/**
 * Created with JetBrains WebStorm.
 * User: tenglong.jiang
 * Date: 3/25/14
 * Time: 14:01 PM
 * 标题组数据模型
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
	date : String,
	labelId : Number,
    request : {type:Number, default:0},
    deliver : {type:Number, default:0},
    deliverRate : {type:Number, default:0},
    open : {type:Number, default:0},
    openRate : {type:Number, default:0},
    click : {type:Number, default:0},
    clickRate : {type:Number, default:0},
    unsubscribe : {type:Number, default:0},//取消订阅
    unsubscribeRate : {type:Number, default:0},
    bounce : {type:Number, default:0},//软退信
    bounceRate : {type:Number, default:0},
    spam : {type:Number, default:0},//垃圾邮件
    spamRate : {type:Number, default:0},
    report_spam : Number,//垃圾邮件举报
    report_spamRate : {type:Number, default:0},
    invalid : {type:Number, default:0}, //无效邮件
    invalidRate : {type:Number, default:0}
});

mongoose.model('ScStat', schema);