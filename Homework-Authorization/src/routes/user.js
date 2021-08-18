const router = require('express').Router();

module.exports = (db) => {
  router.get('/:id', async (req, res, next) => {
    const uid = req.params.id;
    try {
      // Check if user exists
      const user = await db.findUserById(uid);
      // Fetch items for user
      const items = await db.findAllItemsByUser(user.id);
      res.status(200).send(items);
    } catch (error) {
      error.msg = `Failed to fetch items for user (id: ${uid || 'n/a'})`;
      error.type = 'malformed-request';
      next(error);
    }
  });

  return router;
};
