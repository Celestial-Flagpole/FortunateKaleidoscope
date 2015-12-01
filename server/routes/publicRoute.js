'use strict';
// Public route for downloading and exporting snippets
var publicController = require('../controller/publicController');
var request = require('request-json');
var client = request.createClient('https://api.github.com/');

module.exports = function (app) {
  app.get('/download/:snippetId', publicController.downloadSnippet);

  // First constructs a file that can be sent to Github API to create a Gist with
  // Then builds up the data object that Github requires for creating a Gist
  // Then hits the Github API using an NPM module called request
  // Upon success, sends the Gist back to the client. 
  // Client then redirects user to the newly created Gists
  // The reason we can't redirect directly from the back-end is because of Cross-origin issue
  app.post('/download/gist', function (req, res) {
  var username = 'iam-peekay';
  var snippetId = req.body.snippetId;
  
  publicController.exportToGist(snippetId)
    .then(function (result) {
      var fileName = JSON.stringify(result.fileName);
      var fileContent = result.fileContent;
      var data = {
          "description": "",
          "public": true,
          "files": {}
        };
        data["files"]["" + fileName] = { "content": fileContent };
        data["description"] = "Gist for " + fileName;

        client.post('gists', data, function (err, response, body) {
          if (err) {
            console.error(err);
          } else {
            res.json(response);
          }
        });
    });
});

};
