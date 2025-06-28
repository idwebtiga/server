module.exports = (app) => {
  const public = require('../controllers/public.controllers.js');
  const router = require('express').Router();
  router.get('/version', public.version);
  app.use('/api/public', router);
};
