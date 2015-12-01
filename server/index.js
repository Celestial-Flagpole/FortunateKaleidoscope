'use strict';
// Main server file that instantiates a http server using Express/Node.
// Server is listening on port 3000
var express = require('express');
var app = express();

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('listening on ' + port);
});

// Inject app server and express into file where we configure server 
require('./config/middleware.js')(app, express);
