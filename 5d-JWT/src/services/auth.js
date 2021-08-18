const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ALGO = process.env.JWT_ALGO;
const JWT_EXPIRY = process.env.JWT_EXPIRY;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

module.exports = (db) => {
  const service = {};

  service.createToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
      algorithm: JWT_ALGO,
      expiresIn: JWT_EXPIRY,
    });
  };

  service.registerUser = async (username, password) => {
    // Check if username already exists
    const user = await db.findUserByUsername(username);
    if (user) {
      return null;
    } else {
      // Create new user with username and hashed password
      const hashed = await bcrypt.hash(password, SALT_ROUNDS);
      if (hashed) {
        const newUser = await db.insertUser({
          username,
          password_hash: hashed,
        });
        // Generate token for new user
        const token = service.createToken({ id: newUser.id });
        return token;
      } else {
        throw new Error({ msg: 'Unable to generate password hash' });
      }
    }
  };

  service.loginUser = async (username, password) => {
    // Check if username exists
    const user = await db.findUserByUsername(username);
    if (!user) {
      return null;
    } else {
      // Check password hash
      const isCorrectPassword = await service.checkPassword(
        password,
        user.password_hash
      );
      if (isCorrectPassword) {
        // Generate token for authenticated user
        const token = service.createToken({ id: user.id });
        return token;
      } else {
        return null;
      }
    }
  };

  service.checkPassword = (password, hash) => {
    return bcrypt.compare(password, hash);
  };

  return service;
};
