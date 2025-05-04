const router = require('express').Router();

const controller = require('../controllers/user.controller');
const middleware = require('../middleware/authorization');

// Register a new user.
// POST /users/register
router.post('/register', controller.registerUser);

// Login an exsiting user
// POST /users/login
router.post('/login', controller.loginUser);

// Retrieve user information by ID.
// GET  /users/:id
router.get('/:id', controller.getUserById);

// Update user information by ID.
// PUT  /users/:id
// add middleware before allowing an update to ensure the user has a valid token
router.put('/:id', middleware.verifyToken, controller.updateUserByID);

module.exports = router;
