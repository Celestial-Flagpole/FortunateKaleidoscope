var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var archiver = require('archiver');
var mkpathAsync = Promise.promisify(require('mkpath'));

// Zip Folder
  // Takes a srcPath which is where all of the user's snippets live
  // passes out the filePath for zip when done.
var zipFolder = function (srcPath, writePathZip) {

  return mkpathAsync(writePathZip).then(function () {
    return new Promise(function (resolve, reject) {
      // Create zipFile name
      var outPath = writePathZip + Date.now() + '.zip';
      // Create write stream
      var output = fs.createWriteStream(outPath);
      // Archive type
      var zipArchiver = archiver('zip');
      // pass outPath down the chain on close.
      output.on('close', function () {
        resolve(outPath);
      });
      // Create pipe
      zipArchiver.pipe(output);
      // Takes all files in folder and zips.
      zipArchiver.bulk([
        { src: [ '**/*' ], cwd: srcPath, expand: true }
      ]);
      zipArchiver.finalize(function (err) {
        if (err) {
          reject(err);
        }
      });
    });
  });
};


module.exports = {
  writeFile: Promise.promisify(fs.writeFile),
  zipFolder: zipFolder,
  mkpathAsync: mkpathAsync

};
