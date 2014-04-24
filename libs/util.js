//var xss = require('xss');
var fs = require('fs');
exports.format_date = function (date, friendly) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  
  if (friendly) {
    var now = new Date();
    var mseconds = -(date.getTime() - now.getTime());
    var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
    if (mseconds < time_std[3]) {
      if (mseconds > 0 && mseconds < time_std[1]) {
        return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
      }
      if (mseconds > time_std[1] && mseconds < time_std[2]) {
        return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
      }
      if (mseconds > time_std[2]) {
        return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
      }
    }
  }
  
  //month = ((month < 10) ? '0' : '') + month;
  //day = ((day < 10) ? '0' : '') + day;
  //hour = ((hour < 10) ? '0' : '') + hour;
  //minute = ((minute < 10) ? '0' : '') + minute;
  //second = ((second < 10) ? '0': '') + second;

  //thisYear = new Date().getFullYear();
  //year = (thisYear === year) ? '' : (year + '-');
  return year +"-"+ month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function(html){
  var codeSpan = /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm;
  var codeBlock = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g;
  var spans = [];
  var blocks = [];
  var text = String(html).replace(/\r\n/g, '\n')
  .replace('/\r/g', '\n');
  
  text = '\n\n' + text + '\n\n';

  text = text.replace(codeSpan, function(code) {
    spans.push(code);
    return '`span`';
  });

  text += '~0';

  return text.replace(codeBlock, function (whole, code, nextChar) {
    blocks.push(code);
    return '\n\tblock' + nextChar;
  })
  .replace(/&(?!\w+;)/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/`span`/g, function() {
    return spans.shift();
  })
  .replace(/\n\tblock/g, function() {
    return blocks.shift();
  })
  .replace(/~0$/,'')
  .replace(/^\n\n/, '')
  .replace(/\n\n$/, '');
};

/**
 * 过滤XSS攻击代码
 *
 * @param {string} html
 * @return {string}
 */
exports.xss = function (html) {
  //return xss(html);
};
/**
 * Copies all the properties of config to obj.
 * @param {Object} obj The receiver of the properties
 * @param {Object} config The source of the properties
 * @return {Object} returns obj
 * @member apply
 */
exports.apply = function(o, c){
    if(o && c && typeof c === 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};

function isArray(v) {
    return Object.prototype.toString.call(v) === '[object Array]';
}
exports.isArray = isArray;
exports.isEmpty = function(v, allowBlank){
    return v === null || v === undefined || ((isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
};
exports.isDate = function(v){
  return Object.prototype.toString.call(v) === '[object Date]';
};
exports.isObject = function(v){
    return !!v && Object.prototype.toString.call(v) === '[object Object]';
};
exports.isFunction = function(v){
    return Object.prototype.toString.call(v) === '[object Function]';
};
exports.isNumber = function(v){
    return typeof v === 'number';
};
exports.isString = function(v){
    return typeof v === 'string';
};
exports.isBoolean = function(v){
    return typeof v === 'boolean';
};
exports.isElement = function(v) {
    return v ? !!v.tagName : false;
};
exports.isDefined = function(v){
    return typeof v !== 'undefined';
};
exports.writeFile = function writeFile(path, data, callback) {
  var fileName = path;//key + "/" + name; 
  fs.appendFile(fileName, data, 'utf8', function (err) {
    if (err) {
      console.log(err);
    }
    if(typeof callback === "function") {
      callback();
    }
  });
}