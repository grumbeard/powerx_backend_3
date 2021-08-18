const router = require('express').Router();
const auth = require('./auth');
const item = require('./item');

module.exports = (db, authServices, authMiddleWare) => {
  router.get('/', (req, res) => {
    res.status(200).send('Please login or register');
  });

  router.use('/', auth(authServices));
  router.use(authMiddleWare);

  router.use('/items', item(db));

  router.all('*', (req, res, next) => {
    res
      .status(404)
      .set({ 'Content-Type': 'text/html' })
      .send('<h1>No Page Found</h1><a href="/items">Back</a>');
  });

  return router;
};
