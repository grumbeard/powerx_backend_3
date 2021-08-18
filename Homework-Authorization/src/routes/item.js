const router = require('express').Router();

module.exports = (db) => {
  router.get('/', async (req, res, next) => {
    const items = await db.findAllItems();
    res.status(200).send(items);
  });

  router.post('/', async (req, res, next) => {
    const { quantity, name } = req.body;
    try {
      const item = await db.insertItem({ quantity, name });
      res.status(201).send(item);
    } catch (error) {
      error.msg = `Failed to create record for ${name || 'item with no name'}`;
      error.type = 'malformed-request';
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
      const item = await db.findItem(id);
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

  router.put('/:id', async (req, res, next) => {
    const { quantity, name } = req.body;
    const id = req.params.id;
    try {
      const item = await db.updateItem(id, { quantity, name });
      res.status(201).send(item);
    } catch (error) {
      error.msg = `Failed to update record for ${name || 'item with no name'}`;
      error.type = 'malformed-request';
      next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
      const success = await db.deleteItem(id);
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

  return router;
};
