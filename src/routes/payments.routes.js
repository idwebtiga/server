const { checkHeaderToken } = require('../helpers/auth.js');

module.exports = (app) => {
  const payments = require('../controllers/payments.controllers.js');
  const router = require('express').Router();
  const router2 = require('express').Router();

  router.post('/', payments.create);
  router.get('/me', payments.findMe);
  router.get('/items', payments.findItems);
  
  router2.get('/list', payments.findAll);

  app.use('/api/payments', checkHeaderToken, router);
  app.use('/api/admin/payments', checkHeaderToken, router2);
};
