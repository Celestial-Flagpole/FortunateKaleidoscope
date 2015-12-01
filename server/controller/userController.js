'use strict';
var writeSnippet = require('../lib/helpers').writeSnippet;
var rootFolder = require('../../rootPath');
var Promise = require('bluebird');
var helpers = require('../lib/helpers');
var utils = require('../lib/utils');

module.exports = {
  // Finds all the snippets for a single user
  userPage: function (req, res) {
    var username = req.url.slice(1);
    helpers.getSnippetsByUser(username, function (err, result) {
      if (err) {
        console.error(err);
      } else {
        res.json(result);
      }
    });
  },

  getUserSnippet: function (req, res) {
    res.json(req.snippetJSON);
  },

  // Updates a single snippet owned by a user
  updateSnippet: function (req, res) {
    req.body.id = req.params.snippetID;
    helpers.updateSnippet(req).then(function (result) {
      res.json(result);
    }).catch(function (err) {
      console.log(err);
      res.redirect('/');
    });
  },

  // Creates a new follower for a user
  followUser: function (req, res) {
    var userToFollow = req.body.userToFollow;
    var user = req.body.user;
    helpers.followUser(userToFollow, user)
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        console.log(err);
        res.redirect('/');
      });
  },

  // Gets all followers for a single user
  getFollowers: function (req, res) {
    var username = req.params.username;

    helpers.getFollowers(username)
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        console.log(err.message);
        res.redirect('/');
      });
  },

  // Downloads snippets and saves it to a zipfile
  downloadSnippets: function (req, res) {
    // Get username
    var username = req.params.username;
    var folder = rootFolder + '/server/tmp/' + Date.now() + '/';
    var zipFolder = rootFolder + '/server/zip/' + Date.now() + '/';
      // getSnippetsByUser ->
    helpers.getSnippetsByUser(username, function (err, results) {
       // convert each to json
      if (err) {
        res.sendStatus(501);
      }
       // writeSnippet array of promises

      var snippets = results.map(function (result) {
        return utils.writeSnippetFile(result.toJSON(), folder);
      });
      // Map over snippets then
      Promise.all(snippets).then(function (results) {
        console.log(results);
        // when done, zip up folder
        utils.zipFolder(folder, zipFolder).then(function (zipFile) {
          // res download the zip folder
          res.download(zipFile, Date.now() + '.zip', function () {
            // on complete, delete the folder.
            utils.cleanFolder(folder);
            utils.cleanFolder(zipFolder);
          });
        });
      }).catch(function (err) {
        res.sendStatus(501, err);
      });
    });
  }
};
