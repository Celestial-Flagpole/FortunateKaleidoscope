'use strict';
var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require('./passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');

if (process.env.NODE_ENV === 'production') {
  var SESSION_SECRET = process.env.SESSION_SECRET;
} else {
  var SESSION_SECRET = require('../lib/secrets').SESSION_SECRET;
}

module.exports = function (app, express) {
  // Logger
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

  // Uses cookies for client side to use
  app.use(cookieParser());

  // Uses sessions
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

  // Set up routes
  var authRoute = express.Router();
  var publicRoute = express.Router();
  var apiRoute = express.Router();
  var userRoute = express.Router();

  app.use('/', publicRoute);
  require('../routes/publicRoute')(publicRoute);

  app.use('/auth', authRoute);
  require('../routes/authRoute')(authRoute);

  app.use('/api', apiRoute);
  require('../routes/apiRoute')(apiRoute);

  // app.use('/user', userRoute);
  // require('../routes/userRoute')(userRoute);

};
