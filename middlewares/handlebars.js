const exphbs = require('express-handlebars');

module.exports = app => {
  app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
  app.set('view engine', 'handlebars');
};