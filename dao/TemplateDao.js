/**
 * Created with JetBrains WebStorm.
 * User: P0018766
 * Date: 13-1-23
 * Time: 下午4:37
 * To change this template use File | Settings | File Templates.
 */

var DaoBase = require('./DaoBase'),
    models = require('./../models'),
    Template = models.Template;

var TemplateDao = new DaoBase(Template);
module.exports = TemplateDao;