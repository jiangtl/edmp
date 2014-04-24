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
    name : String,
    title_list : Array, 
    create_user : String,
    update_user : String,
    create_at : { type:Date, default:Date.now },
    update_at : { type:Date, default:Date.now }
});

mongoose.model('TitleGroup', schema);