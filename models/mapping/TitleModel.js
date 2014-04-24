/**
 * Created with JetBrains WebStorm.
 * User: tenglong.jiang
 * Date: 4/17/14
 * Time: 14:01 PM
 * 标题数据模型
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name : String,
    create_user : String,
    update_user : String,
    create_at : { type:Date, default:Date.now },
    update_at : { type:Date, default:Date.now }
});

mongoose.model('Title', schema);