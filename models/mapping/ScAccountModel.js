/**
 * Created with JetBrains WebStorm.
 * User: tenglong.jiang
 * Date: 4/9/14
 * Time: 18:16 PM
 * SC账号数据模型
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    username : String, //昵称
    password : String, 
    from : String, //发件地址
    fromname : String,//发件人名称
    delsign : { type : Number, default : 0 }, //0：未删除  1：逻辑删除
    create_user : String,
    update_user : String,
    create_at : { type:Date, default:Date.now },
    update_at : { type:Date, default:Date.now }
});

mongoose.model('ScAccount', schema);