module.exports = (service) => {
  // Method to check for Authentication token in Request Headers
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Format of authHeader: 'Bearer eyJhbGciOiJIUzI1Ni....'
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const { uid } = await service.verifyToken(token);
        if (uid) {
          req.uid = uid;
          next();
        } else {
          throw new Error();
        }
      } catch (error) {
        error.msg = 'Invalid token provided';
        error.type = 'unauthorized';
        next(error);
      }
    } else {
      res.redirect('/');
    }
  };
};
