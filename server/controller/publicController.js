'use strict';
var utils = require('../lib/utils');
var helpers = require('../lib/helpers');
var rootFolder = require('../../rootPath');
// var request = require('request');

// /download/:snippetID

// Takes the snippet ID and does a look up
// when it finds the Snippet, it writes it to file, then sends it out as a download
module.exports = {
  downloadSnippet: function (req, res) {
    var snippetID = req.params.snippetId;
    var folder = rootFolder + '/server/tmp/' + Date.now() + '/';
    helpers.getSnippet(snippetID)
            .then(function (result) {
              utils.writeSnippetFile(result.toJSON(), folder).then(function (file) {
                res.download(file.filePath, file.fileName, function (err) {
                if (err) {
                  console.log(res.headersSent);
                }
                utils.cleanFolder(folder);
              });
            });
           })
          .catch(function (err) {
           res.redirect('/');
          });
  },

  downloadAtomSnippet: function (req, res) {
    var snippetID = req.params.snippetId;
    console.log(snippetID);
    var folder = rootFolder + '/server/tmp/' + Date.now() + '/';
    helpers.getSnippet(snippetID)
            .then(function (result) {
              console.log("RESULT", result);
              utils.writeSnippetFileAtom(result.toJSON(), folder).then(function (file) {
                console.log("FILE", JSON.stringify(file));
                res.download(file.filePath, file.fileName, function (err) {
                if (err) {
                  console.log(err);
                }
                utils.cleanFolder(folder);
              });
            });
           })
          .catch(function (err) {
            console.log("ERROR", err);
           res.redirect('/');
          });
  },

  exportToGist: function (snippetId) {
    return helpers.getSnippet(snippetId)
      .then(function (result) {
        return utils.writeFileForGist(result.toJSON());
      })
      .catch(function (err) {
        res.redirect('/');
      });
  }
};
