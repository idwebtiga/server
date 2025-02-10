const { checkHeaderToken } = require('../helpers/auth.js');

module.exports = (app) => {
  const topups = require('../controllers/topups.controllers.js');
  const router = require('express').Router();
  const router2 = require('express').Router();

  router.post('/', topups.create);
  router.get('/me', topups.findMe);
  router.delete('/me/:id', topups.cancel);

  router2.get('/list', topups.findAll);
  router2.patch('/approve/:id', topups.approve);
  router2.patch('/mint/:id', topups.mint);

  app.use('/api/topups', checkHeaderToken, router);
  app.use('/api/admin/topups', checkHeaderToken, router2);
};
