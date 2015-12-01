'use strict';
// Main file that configures out express server
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('./passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// Establish session key
if (process.env.NODE_ENV === 'production') {
  var SESSION_SECRET = process.env.SESSION_SECRET;
} else {
  var SESSION_SECRET = require('../lib/secrets').SESSION_SECRET;
}

module.exports = function (app, express) {
  // Cors headers middleware
  //app.use(cors());
  // Logger middleware
  app.use(morgan('dev'));
  // Parses posts requests
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // Establish static route
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(process.cwd() + '/client'));
  } else {
    app.use(express.static(__dirname + '/../../client'));
  }

  // Middleware for parsing cookies, for client side to use
  app.use(cookieParser());

  // Middleware for user sessions
  app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    sessionid: function (req) {
      return req.cookie.username;
    }
  }));

  // Inits passport sessions
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up seperate sub routes
  var authRoute = express.Router();
  var publicRoute = express.Router();
  var apiRoute = express.Router();
  var userRoute = express.Router();

  app.use('/', publicRoute);
  app.use('/auth', authRoute);
  app.use('/api', apiRoute);

  // Inject subroutes into appropriate router files 
  require('../routes/authRoute')(authRoute);
  require('../routes/publicRoute')(publicRoute);
  require('../routes/apiRoute')(apiRoute);

};
