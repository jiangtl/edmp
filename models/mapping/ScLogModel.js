/**
 * Created with JetBrains WebStorm.
 * User: tenglong.jiang
 * Date: 3/25/14
 * Time: 14:01 PM
 * SCLOG数据模型
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    date : String,
    timestamp : Number,
    category : String,
    recipientArray : String,
    event : String,
    recipientSize : Number,
    labelId : Number,
    ip: String,
    oSName : String,
    explorerName : String,
    recipientSize : { type:Number, default:1}
    });

mongoose.model('ScLog', schema);