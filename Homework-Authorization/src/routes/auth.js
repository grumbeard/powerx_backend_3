const router = require('express').Router();

module.exports = (service) => {
  router.post('/register', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const token = await service.registerUser(username, password);
      if (token) {
        res.status(200).send({ token: token });
      } else {
        throw new Error('user-exists');
      }
    } catch (error) {
      switch(error.message) {
      case 'user-exists':
        error.message = `User '${req.body.username}' already exists`;
        error.cause = 'malformed-request';
        break;
      default:
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
        throw new Error('incorrect-credentials');
      }
    } catch (error) {
      switch (error.message) {
      case 'incorrect-credentials':
        error.message = `Username '${username}' does not exist or password is incorrect`;
        error.cause = 'malformed-request';
        break;
      default:
        error.message = 'Invalid inputs provided';
        error.cause = 'malformed-request';
      }
    }
  });

  return router;
};
