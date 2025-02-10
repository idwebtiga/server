const { checkHeaderToken } = require('../helpers/auth.js');

module.exports = (app) => {
  const transactions = require('../controllers/transactions.controllers.js');
  const router = require('express').Router();

  router.post('/buyToken', transactions.buyToken);

  app.use('/api/transactions', checkHeaderToken, router);
};
