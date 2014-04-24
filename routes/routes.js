/**
 * Created with JetBrains WebStorm.
 * User: tenglong.jiang
 * Date: 3/25/14
 * Time: 9:47 AM
 * To change this template use File | Settings | File Templates.
 */

var index = require('./index');
var emailgroup = require('./emailgroup');
var template = require('./template');
var title = require('./title');
var scaccount = require('./scaccount');
var task = require('./task');
var login = require('./login');
var user = require('./user');
var sclog = require('./sclog');
var scstat = require('./scstat');
var test = require('./test');
module.exports = function (app) {
    app.get('/', index.index);
    //邮件组
    app.get('/emailgroup', emailgroup.list);
    app.post('/emailgroup/create', emailgroup.create);    
    app.get('/emailgroup/delete', emailgroup.delete);
    app.get('/emailgroup/check', emailgroup.check);
    app.get('/emailgroup/getList', emailgroup.getList);
    //模版
    app.get('/template', template.list);
    app.post('/template/preview', template.preview);
    app.post('/template/create', template.create);
    app.post('/template/update', template.update);
    app.get('/template/delete', template.delete);
    app.get('/template/getList', template.getList);
    //标题
    app.get('/title', title.list);
    app.post('/title/create', title.create);
    app.post('/title/update', title.update);
    app.get('/title/delete', title.delete);
    app.get('/title/getList', title.getList);
    //SC账号
    app.get('/scaccount', scaccount.list);
    app.post('/scaccount/create', scaccount.create);
    app.post('/scaccount/update', scaccount.update);
    app.get('/scaccount/delete', scaccount.delete);
    app.get('/scaccount/check', scaccount.check);
    app.get('/scaccount/getList', scaccount.getList);
    //任务
    app.get('/task', task.list);
    app.post('/task/create', task.create);
    app.post('/task/update', task.update);
    app.get('/task/delete', task.delete);
    app.get('/task/check', task.check);
    app.get('/task/send', task.send);
    //登陆
    app.post('/login.action', login.check);
    app.get('/logout', login.logout);
    //用户
    app.get('/user', user.list);
    app.post('/user/create', user.create);
    app.post('/user/update', user.update);
    app.get('/user/delete', user.delete);
    app.get('/user/check', user.check);
    app.get('/user/getAccountList', user.getList);
    //统计
    app.get('/scstat', scstat.list);
    //test
    app.get('/test', test.list);
};