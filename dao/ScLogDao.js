/**
 * Created with JetBrains WebStorm.
 * User: Jack
 * Date: 13-4-16
 * Time: 上午10:40
 * To change this template use File | Settings | File Templates.
 */
var DaoBase = require('./DaoBase'),
    models = require('./../models'),
    ScLog = models.ScLog;

var ScLogDao = new DaoBase(ScLog);

module.exports = ScLogDao;