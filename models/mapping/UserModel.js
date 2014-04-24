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
    login_name : String, //登录名
    password : String, 
    email : String, 
    name : String, //姓名
    company : String,
    phone : String,
    sex : String,
    address : String,
    //account : [{name : String, password : String, from : String, fromname : String}],
    delsign : { type : Number, default : 0 }, //0：未删除  1：逻辑删除
    create_user : String,
    update_user : String,
    create_at : { type:Date, default:Date.now },
    update_at : { type:Date, default:Date.now }
});

mongoose.model('User', schema);