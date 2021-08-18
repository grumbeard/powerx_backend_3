const router = require('express').Router();

module.exports = (service) => {
  router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    const token = await service.registerUser(username, password);
    if (token) {
      res.status(200).send({ token: token });
    } else {
      res.status(400).send(`User '${username}' already exists`);
    }
  });

  router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    const token = await service.loginUser(username, password);
    if (token) {
      res.status(200).send({ token: token });
    } else {
      res
        .status(400)
        .send(`Username '${username}' does not exist or password is incorrect`);
    }
  });

  return router;
};
