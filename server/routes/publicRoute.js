'use strict';
var publicController = require('../controller/publicController');
var request = require('request-json');
var client = request.createClient('https://api.github.com/');

module.exports = function (app) {
  app.get('/download/:snippetId', publicController.downloadSnippet);

  app.post('/download/gist', function (req, res) {
  var username = 'iam-peekay';
  var snippetId = req.body.snippetId;
  
  publicController.exportToGist(snippetId)
    .then(function (result) {
      var fileName = JSON.stringify(result.fileName);
      var fileContent = result.fileContent;
      var data = {
          "description": "TEST",
          "public": true,
          "files": {}
        };
        data["files"]["" + fileName] = { "content": fileContent };

        client.post('gists', data, function (err, response, body) {
          if (err) {
            console.error(err);
          } else {
            
            res.set({
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE',
              'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type,Authorization'
            }); 
            console.log(response)
            res.json(response);
            // res.redirect(response.body.html_url);
          }
        });
    });
});

};
