'use strict';
module.exports = function (snipObj) {
  var body = unescape(snipObj.text);
  var scope = snipObj.scope;
  var prefix = unescape(snipObj.tabPrefix);
  var name = unescape(snipObj.title);
  return "'." + scope + "':\n" +
    "'" + name + "':" +
    "'prefix': " + prefix +
    "'body': " + body
};