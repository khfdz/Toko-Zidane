const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');

// Route to register a new user
router.post('/register', authController.register);

// Route to login a user
router.post('/login', authController.login);

// Apply authentication middleware for protected routes
router.use(authenticate);

// Route to get user profile from JWT token
router.get('/profile', authController.getProfile);

// Route to get all users
router.get('/', authController.getAllUsers);

// Route to get a single user by ID
router.get('/:id', authController.getUserById);

// Route to update a user by ID
router.put('/:id', authController.updateUserById);

// Route to delete a user by ID
router.delete('/:id', authController.deleteUserById);

module.exports = router;
