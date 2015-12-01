'use strict';
var getSnippet = require('../lib/helpers').getSnippet;
// Checks to see if user is authenticated. Used for logged-in user requests  
exports.authMiddleware = function (req, res, next) {
  if (req.isAuthenticated()) { 
    next();
  } else {
    res.redirect('/');
  }
};

// Check to see if snippet belongs to user. Used for logged-in user requests
exports.confirmUserSnippet = function (req, res, next) {
  var snippetID = req.params.snippetID;
  var username = req.params.username;
  
  getSnippet(parseInt(snippetID)).then(function (snip) {
    var snipJSON = snip.toJSON();
    if (username === snip.user.username) {
      req.snippetJSON = snipJSON;
      next();
    } else {
      res.redirect('/');
    }
  }).catch(function (err) {
    res.redirect('/');
  });
};
