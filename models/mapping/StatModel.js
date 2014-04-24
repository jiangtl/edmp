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
    request : Number,
    deliver : Number,
    open : Number, 
    click : Number,
    unsubscribe : Number,//取消订阅
    bounce : Number,//软退信
    spam : Number,//垃圾邮件
    report_spam : Number,//垃圾邮件举报
    invalid : Number //无效邮件

});

mongoose.model('Stat', schema);