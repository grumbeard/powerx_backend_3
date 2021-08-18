require('dotenv').config();
const App = require('./app');
const Router = require('./routes');
const AuthService = require('./services/auth');
const db = require('./db');
const AuthMiddleware = require('./middlewares/auth');

const authService = AuthService(db);
const authMiddleWare = AuthMiddleware(authService);
const router = Router(db, authService, authMiddleWare);
const app = App(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
