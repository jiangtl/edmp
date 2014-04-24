/**
 * Created with JetBrains WebStorm.
 * User: Jack
 * Date: 14-4-17
 * Time: 下午4:37
 * To change this template use File | Settings | File Templates.
 */

var DaoBase = require('./DaoBase'),
    models = require('./../models'),
    ScStat = models.ScStat;

var ScstatDao = new DaoBase(ScStat);
module.exports = ScstatDao;