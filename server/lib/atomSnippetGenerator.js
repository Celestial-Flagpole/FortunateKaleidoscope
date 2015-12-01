'use strict';
module.exports = function (snipObj) {
  console.log("SNIPOBJ", unescape(snipObj.text));
  return "'." + snipObj.scope + "':\n" +
    "\t'" + unescape(snipObj.title) + "':\n" +
    "\t\t'prefix': " + "'" + snipObj.tabPrefix + "'\n" +
    "\t\t'body': '" + unescape(snipObj.text) + "'";
};