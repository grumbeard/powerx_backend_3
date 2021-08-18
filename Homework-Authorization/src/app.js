const express = require('express');
const logger = require('morgan');

module.exports = (router) => {
  const app = express();
  app.use(express.json());
  app.use(logger('common'));

  app.use(router);

  app.use((error, req, res, next) => {
    if (error.type === 'malformed-request') {
      console.log(error.msg);
      res.status(400).send(error);
    } else if (error.type === 'unauthorized') {
      console.log(error.msg);
      res.status(401).send(error);
    } else {
      console.log('Some error occured');
      res.status(500).send(error);
    }
  });

  return app;
};
