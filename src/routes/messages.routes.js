module.exports = (app) => {
  const messages = require('../controllers/messages.controllers.js');
  const router = require('express').Router();
  router.get('/', messages.findAll);
  router.post('/', messages.create);
  app.use('/api/messages', router);
};
