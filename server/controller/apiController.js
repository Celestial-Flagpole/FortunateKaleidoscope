'use strict';
// Controller for hangling main API requests 
var dummyData = require('../../test/dummyData');
var helpers = require('../lib/helpers');

module.exports = {
  // Fetches top 20 snippets from the database
  getMostRecent: function (req, res) {
    helpers.getSnippetsMostRecent().then(function (snips) {
      var resSnips = snips.map(function (snip) {
        return snip.toJSON();
      });
      res.json(resSnips);
    }).catch(function (err) {
      res.sendStatus(501, err);
    });
  },

  // Adds a new snippet to the database
  writeSnippet: function (req, res) {
    helpers.writeSnippet(req, function () {
        res.json({created: true});
      });
  },

  forkSnippet: function (req, res) {
    helpers.forkSnippet(req, function () {
        res.json({created: true});
      });
  },

  // Increases star count for a snippet
  starSnippet: function (req, res) {
    helpers.starSnippet(req, function (err, snippet) {
      if (err) {
        console.error(err);
      } else {
        res.json(snippet);
      }
    });
  },

  searchSnips: function (req, res) {
    res.json(dummyData);
  },

};
