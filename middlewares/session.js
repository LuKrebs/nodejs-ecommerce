const session = require('express-session');
const keys = require('../config/keys');

module.exports = app => {
  app.use(
    session({
      secret: keys.cookieKey,
      resave: true,
      saveUninitialized: true
    })
  );
};