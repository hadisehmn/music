const express = require('express');
const logger = require('../logger');

module.exports = (service) => {
  const router = express.Router();

  // router.post('/login', async (req, res) => {
  //   try {
  //     const { username, email, password } = req.body;

  //     if (!username || !password) {
  //       logger.warn('POST /auth/login - Missing username or password');
  //       return res.status(400).json({ message: 'Username and password are required' });
  //     }

  //     logger.info(`POST /auth/login attempt for username: ${username}`);
  //     const token = await service.Login(username, email || '', password);

  //     logger.info(`POST /auth/login successful for username: ${username}`);
  //     return res.status(200).json({ message: 'Login successful', token });
  //   } catch (error) {
  //     logger.error(`POST /auth/login failed: ${error.message}`, { error });
  //     return res.status(401).json({ message: 'Username or password may be incorrect' });
  //   }
  // });

  // router.post('/signup', async (req, res) => {
  //   try {
  //     const { username, email, password } = req.body;

  //     if (!username || !email || !password) {
  //       logger.warn('POST /auth/signup - Missing required fields');
  //       return res.status(400).json({ message: 'Username, email, and password are required' });
  //     }

  //     logger.info(`POST /auth/signup attempt for username: ${username}`);
  //     const user = await service.Signup(username, email, password);

  //     logger.info(`POST /auth/signup successful for username: ${username}`);
  //     return res.status(201).json({ message: 'Signup successful', user });
  //   } catch (error) {
  //     logger.error(`POST /auth/signup failed: ${error.message}`, { error });
  //     return res.status(500).json({ message: 'Signup failed' });
  //   }
  // });


// ✅ Route: POST /auth/login
// router.post('/login', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !password) {
//       logger.warn('POST /auth/login - Missing username or password');
//       return res.status(400).json({ message: 'Username and password are required' });
//     }

//     logger.info(`POST /auth/login attempt for username: ${username}`);
//     const token = await service.login(username, email || '', password);

//     logger.info(`POST /auth/login successful for username: ${username}`);
//     return res.status(200).json({ message: 'Login successful', token });

//   } catch (error) {
//     logger.error(`POST /auth/login failed: ${error.message}`, { error });

//     if (error.code === 'USER_NOT_FOUND') {
//       return res.status(404).json({ message: 'User not found, please sign up' });
//     }

//     if (error.code === 'DUPLICATE_DATA') {
//       return res.status(409).json({ message: error.message });
//     }

//     return res.status(401).json({ message: 'Username or password may be incorrect' });
//   }
// });
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      logger.warn('POST /auth/login - Missing fields');
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    logger.info(`POST /auth/login attempt for username: ${username}`);
    const token = await service.login(username, email, password);

    logger.info(`POST /auth/login successful for username: ${username}`);
    return res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    logger.error(`POST /auth/login failed: ${error.message}`, { error });

    if (error.code === 'DUPLICATE_DATA') {
      return res.status(409).json({ message: error.message });
    }

    if (error.code === 'USER_NOT_FOUND') {
      return res.status(404).json({ message: error.message });
    }

    if (error.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Unexpected error during login' });
  }
});
// ✅ Route: POST /auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      logger.warn('POST /auth/signup - Missing required fields');
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    logger.info(`POST /auth/signup attempt for username: ${username}`);
    const user = await service.signup(username, email, password);

    logger.info(`POST /auth/signup successful for username: ${username}`);
    return res.status(201).json({ message: 'Signup successful', user });

  } catch (error) {
    logger.error(`POST /auth/signup failed: ${error.message}`, { error });

    if (error.code === 'DUPLICATE_USER') {
      return res.status(409).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Signup failed' });
  }
});
  
  

  return router;
};
