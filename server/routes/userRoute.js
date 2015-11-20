'use strict';
// /api/user route
var userController = require('../controller/userController');
var authMiddleware = require('../config/authMiddleware').authMiddleware;
var confirmUserSnippet = require('../config/authMiddleware').confirmUserSnippet;

module.exports = function (app) {
  app.get('/:username', userController.userPage);
  app.get('/:username/download', userController.downloadSnippets);
  // TODO: Get auth to work for the following two routes. For some reason
  // express.session is regenerating sessionIDs on the get request. Super weird.
  // Someone please fix.
  app.post('/:username/follow', userController.followUser);
  app.get('/:username/:snippetID', confirmUserSnippet, userController.getUserSnippet);
  app.post('/:username/:snippetID', confirmUserSnippet, userController.updateSnippet);
};
