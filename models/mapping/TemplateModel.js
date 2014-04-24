/**
 * Created with JetBrains WebStorm.
 * User: tenglong.jiang
 * Date: 3/25/14
 * Time: 14:01 PM
 * 邮件模版数据模型
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name : String,
    html : String, 
    deadline : String, //截止日期，可选项
    delsign : { type : Number, default : 0 }, //0：未删除  1：逻辑删除
    create_user : String,
    update_user : String,
    create_at : { type:Date, default:Date.now },
    update_at : { type:Date, default:Date.now }
});

mongoose.model('Template', schema);