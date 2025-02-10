const { checkHeaderToken } = require('../helpers/auth.js');

module.exports = (app) => {
  const users = require('../controllers/users.controllers.js');
  const router = require('express').Router();

  router.post('/auth', users.auth);
  router.post('/authSiwe', users.authSiwe);
  router.get('/profile', checkHeaderToken, users.profile);

  app.use('/api/users', router);
};
