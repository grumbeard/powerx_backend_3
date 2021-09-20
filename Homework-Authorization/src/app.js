const express = require('express');
const logger = require('morgan');

module.exports = (router) => {
  const app = express();
  app.use(express.json());
  app.use(logger('common'));

  app.use(router);

  app.use((error, req, res, next) => {
    if (error.cause === 'malformed-request') {
      console.log(error.message);
      res.status(400).send(error);
    } else if (error.cause === 'unauthorized') {
      console.log(error.message);
      res.status(401).send(error);
    } else {
      console.log('Some error occured');
      console.log(error.message)
      res.status(500).send(error);
    }
  });

  return app;
};
