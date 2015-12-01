'use strict';
var publicController = require('../controller/publicController');
var request = require('request-json');
var client = request.createClient('https://api.github.com/');

module.exports = function (app) {
  app.get('/download/atom/:snippetId', publicController.downloadAtomSnippet);
  app.get('/download/:snippetId', publicController.downloadSnippet);
  // app.get('/download/:snippetId', publicController.downloadAtomSnippet);

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
            // res.redirect(response.body.html_url);
          }
        });
    });
});

};
