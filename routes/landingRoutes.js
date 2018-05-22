
module.exports = app => {

  app.get('/', (req, res) => {
    const title = "Sonja Baby's Acessórios";
    res.render('index', {
      title: title
    });
  });
  
  app.get('/about', (req, res) => {
    res.render('about');
  });

};
