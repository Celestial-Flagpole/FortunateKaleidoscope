'use strict';
var writeFile = require('./promises').writeFile;
var sublimeSnippetTemplate = require('./sublimeSnippetGenerator');
var atomSnippetTemplate = require('./atomSnippetGenerator');
var mkpathAsync = require('./promises').mkpathAsync;
var path = require('path');
var del = require('del');
var Promise = require('bluebird');

// Takes outFolder generated when request is made
// makes the path then writes a generated snippet to the folder
// returned as a promise.
var writeSnippetFile = function (snipObj, outFolder) {
  var fileName = escape(snipObj.title) + '.sublime-snippet';
  var filePath = outFolder + fileName;
  return mkpathAsync(outFolder).then(function () {
    return writeFile(filePath,
      sublimeSnippetTemplate(snipObj),
      'utf8').then(function () {
        return {filePath: filePath, fileName: fileName};
      });
  });
};

var writeSnippetFileAtom = function (snipObj, outFolder) {
  var fileName = escape(snipObj.title) + '.cson';
  var filePath = outFolder + fileName;
  return mkpathAsync(outFolder).then(function () {
    return writeFile(filePath,
      atomSnippetTemplate(snipObj),
      'utf8').then(function () {
        return {filePath: filePath, fileName: fileName};
      });
  });
};

var writeFileForGist = function (snipObj) {
    var fileName = escape(snipObj.title) + '.sublime-snippet';
    var fileContent = sublimeSnippetTemplate(snipObj);
    return {fileContent: fileContent, fileName: fileName};
};

var cleanFolder = function (folderPath) {
  return del(folderPath + '/**');
};

module.exports = {
  writeSnippetFile: writeSnippetFile,
  writeSnippetFileAtom: writeSnippetFileAtom,
  zipFolder: require('./promises').zipFolder,
  cleanFolder: cleanFolder,
  writeFileForGist: writeFileForGist
};
