require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../../logger'); 

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  logger.error('SECRET_KEY is not set in environment variables.');
  process.exit(1); 
}

class AuthMiddleware {
  static middleware(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      logger.warn('Access denied: No token provided');
      return res.status(401).json({ message: 'Invalid token, access denied.' });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      logger.info(`JWT verified for user ID: ${decoded.id || 'unknown'}`);
      req.user = decoded;
      next();
    } catch (err) {
      logger.error(`JWT verification failed: ${err.message}`);
      return res.status(401).json({ message: 'Invalid token, access denied.' });
    }
  }
}

module.exports = AuthMiddleware;
