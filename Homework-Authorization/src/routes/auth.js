const router = require('express').Router();
const { CustomError } = require('../middlewares/errors');

module.exports = (service) => {
  router.post('/register', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const token = await service.registerUser(username, password);
      if (token) {
        res.status(200).send({ token: token });
      } else {
        throw new CustomError(`User '${req.body.username}' already exists`, 'malformed-request');
      }
    } catch (error) {
      if (!error.cause) {
        error.message = 'Invalid inputs provided';
        error.cause = 'malformed-request';
      }
      next(error);
    }
  });

  router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    const token = await service.loginUser(username, password);
    try {
      if (token) {
        res.status(200).send({ token: token });
      } else {
        throw new CustomError(`Username '${username}' does not exist or password is incorrect`, 'malformed-request');
      }
    } catch (error) {
      if (!error.cause) {
        error.message = 'Invalid inputs provided';
        error.cause = 'malformed-request';
      }
      next(error);
    }
  });

  return router;
};
