module.exports = (app) => {
  const messages = require('../controllers/messages.controllers.js');
  const router = require('express').Router();
  router.get('/', messages.findAll);
  app.use('/api/messages', router);
};
