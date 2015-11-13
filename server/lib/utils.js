'use strict';
var writeFile = require('./promises').writeFile;
var sublimeSnippetTemplate = require('./sublimeSnippetGenerator');
var mkpathAsync = require('./promises').mkpathAsync;
var path = require('path');
var del = require('del');

var writeSnippetFile = function (snipObj, outFolder) {

  return mkpathAsync(outFolder).then(function(){
    return writeFile(outFolder + escape(snipObj.title) + ".sublime-snippet",
      sublimeSnippetTemplate(snipObj),
      'utf8');
  });
};

var cleanFolder = function (folderPath) {
  return del(folderPath + '/**');
};

module.exports = {
  writeSnippetFile: writeSnippetFile,
  zipFolder: require('./promises').zipFolder,
  cleanFolder: cleanFolder
};