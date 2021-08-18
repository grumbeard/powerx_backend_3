const express = require('express');
const logger = require('morgan');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(logger('common'));

app.use(require('./routes'));

app.use((error, req, res, next) => {
  if (error.type === 'malformed-request') {
    console.log(error.msg);
    res.status(400).send(error);
  } else {
    console.log('Some error occured');
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
