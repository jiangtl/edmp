/**
 * Created with JetBrains WebStorm.
 * User: tenglong.jiang
 * Date: 3/25/14
 * Time: 14:01 PM
 * 发送任务数据模型
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name : String,
    labelId : { type:Number, default:9000000 }, //SC标签值，用于统计，自增长
    num : { type:Number, default:0 },
    title : Array, //邮件组列表，随机发送
    email_group : String,
    template :String,
    scaccount : String, //发送账号
    sendtime : String,  //发送时间
    status : { type:Number, default:0 }, //0：未执行  1：执行中  2：任务结束
    curr_send_index : { type:Number, default:0 }, //发送邮件组当前索引
    delsign : { type : Number, default : 0 }, //0：未删除  1：逻辑删除
    create_user : String,
    update_user : String,
    create_at : { type:Date, default:Date.now },
    update_at : { type:Date, default:Date.now }
});

mongoose.model('Task', schema);