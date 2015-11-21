'use strict';
var publicController = require('../controller/publicController');
var request = require('request-json');
var client = request.createClient('https://api.github.com/');

module.exports = function (app) {
  app.get('/download/:snippetId', publicController.downloadSnippet);

// app.post('/download/gist', function (req, res) {
//   res.send('POST request to the homepage');
// });

    app.post('/download/gist', function (req, res) {
    var snippetId = req.body.snippetId;
    publicController.exportToGist(snippetId)
      .then(function (result) {
        var fileName = result.fileName;
        var fileContent = result.fileContent;
        var data = {
            "description": "TEST",
            "public": true,
            "files": {
              fileName: {
                "content": fileContent
              }
            }
          };

          // var data = {
          //   "description": "the description for this gist",
          //   "public": true,
          //   "files": {
          //     "file1.txt": {
          //       "content": "String file contents"
          //     }
          //   }
          // };

          console.log('data', data);
          client.post('gists', data, function (err, response, body) {
            if (err) {
              console.error(err);
            } else {
              console.log('response', response)
              res.json(response);
            }
          });
      });
  });

};
