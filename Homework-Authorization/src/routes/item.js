const router = require('express').Router();

module.exports = (db) => {
  router.get('/', async (req, res, next) => {
    const items = await db.findAllItems();
    res.status(200).send(items);
  });

  router.post('/', async (req, res, next) => {
    const uid = req.uid;
    const { quantity, name } = req.body;
    try {
      const item = await db.insertItem({ quantity, name, uid });
      res.status(201).send(item);
    } catch (error) {
      error.message = `Failed to create record for ${
        name || 'item with no name'
      }`;
      error.cause = 'malformed-request';
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
      const item = await db.findItem(id);
      if (!item) throw new Error();
      res.status(200).send(item);
    } catch (error) {
      error.message = `Item (id: ${id}) not found`;
      error.cause = 'malformed-request';
      next(error);
    }
  });

  router.put('/:id', async (req, res, next) => {
    const uid = req.uid;
    const { quantity, name } = req.body;
    const id = req.params.id;
    // Check if item belongs to user
    const targetItem = await db.findItem(id);
    try {
      if (targetItem.uid !== uid) throw new Error('unauthorized');
      const item = await db.updateItem(id, { quantity, name, uid });
      res.status(201).send(item);
    } catch (error) {
      switch (error.message) {
      case 'unauthorized':
        error.message = `Unauthorized to edit item with id ${id}`;
        error.cause = 'unauthorized';
        break;
      default:
        error.message = `Failed to update record for ${
          name || 'item with no name'
        }`;
        error.cause = 'malformed-request';
        break;
      }
      next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
      const success = await db.deleteItem(id);
      if (success) {
        res.status(201).send(`Item (id: ${id} deleted successfully)`);
      } else throw new Error();
    } catch (error) {
      error.message = `Item (id: ${id}) not found`;
      error.cause = 'malformed-request';
      next(error);
    }
  });

  return router;
};
