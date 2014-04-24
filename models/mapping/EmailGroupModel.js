/**
 * Created with JetBrains WebStorm.
 * User: tenglong.jiang
 * Date: 3/25/14
 * Time: 14:01 PM
 * 邮件组数据模型
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name : String,
    description : String,
    num : { type:Number, default:0 },
    path : String,    
    email_list : Array,
    type : { type:Number, default:1 },  //来源：1.文件导入 2.复制 3.合并
    delsign : { type : Number, default : 0 }, //0：未删除  1：逻辑删除
    create_user : String,
    update_user : String,
    create_at : { type:Date, default:Date.now },
    update_at : { type:Date, default:Date.now }
});

mongoose.model('EmailGroup', schema);