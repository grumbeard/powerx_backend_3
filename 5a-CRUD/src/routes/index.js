const router = require('express').Router();
const db = require('../db');

router.get('/items', (req, res, next) => {
  const items = db.findAllItems();
  res.status(200).send(items);
});

router.post('/items', (req, res, next) => {
  const { quantity, name } = req.body;
  try {
    if (!quantity || !name) {
      throw new Error();
    } else {
      const item = db.insertItem({ quantity, name });
      res.status(201).send(item);
    }
  } catch (error) {
    error.msg = `Failed to create record for ${name || 'item with no name'}`;
    error.type = 'malformed-request';
    next(error);
  }
});

router.get('/items/:id', (req, res, next) => {
  const id = req.params.id;
  try {
    const item = db.findItem(id);
    if (item) {
      res.status(200).send(item);
    } else {
      throw new Error();
    }
  } catch (error) {
    error.msg = `Item (id: ${id}) not found`;
    error.type = 'malformed-request';
    next(error);
  }
});

router.put('/items/:id', (req, res, next) => {
  const { quantity, name } = req.body;
  const id = req.params.id;
  try {
    const item = db.updateItem(id, { quantity, name });
    if (item) {
      res.status(201).send(item);
    } else {
      throw new Error();
    }
  } catch (error) {
    error.msg = `Failed to update record for ${name || 'item with no name'}`;
    error.type = 'malformed-request';
    next(error);
  }
});

router.delete('/items/:id', (req, res, next) => {
  const id = req.params.id;
  try {
    const success = db.deleteItem(id);
    if (success) {
      res.status(201).send(`Item (id: ${id} deleted successfully)`);
    } else {
      throw new Error();
    }
  } catch (error) {
    error.msg = `Item (id: ${id}) not found`;
    error.type = 'malformed-request';
    next(error);
  }
});

router.all('/items/*', (req, res, next) => {
  res
    .status(404)
    .set({ 'Content-Type': 'text/html' })
    .send('<h1>No Page Found</h1><a href="/items">Back</a>');
});

module.exports = router;
