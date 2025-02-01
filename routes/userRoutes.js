const express = require('express');
const router = express.Router();
const {createAdmin, registerUser, loginUser, getUserProfile, updateUserProfile} = require('../controllers/userController');

const {protect} = require('../middleware/authMiddleware');

// POST: Register a new user
router.post("/register", registerUser);
router.get("/register", (req, res) => {
  res.render("register", { message: null, error: null }); // Default messages are null
});

router.post("/create-admin", createAdmin); // Manually trigger admin creation

// POST: Login an existing user
router.post("/login", loginUser);
router.get("/login", (req, res) => {
  res.render("login", { message: null, error: null }); // Default messages are null
});

// Get user profile (Authenticated)
router.get('/me', protect, getUserProfile);

// Update user profile (Authenticated)
router.put('/me', protect, updateUserProfile);

module.exports = router;    