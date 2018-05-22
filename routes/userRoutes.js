module.exports = app => {

  app.get('/users/login', (req, res) => {
    res.send({ login: 'login' })
  });

  app.get('/users/register', (req, res) => {
    res.send({ register: 'register' })
  });

};