const express = require('express');
const router = express.Router();
const { upload } = require("../middleware/upload"); 

// Import middleware
const { protect, checkAdmin } = require('../middleware/authMiddleware');

// Import controllers
const { 
  addTestimonial, 
  getAllTestimonial, 
  getApprovedTestimonials, 
  deleteTestimonial, 
  approveTestimonial 
} = require('../controllers/testimonialController');

// Routes
router.post('/testimonials', protect, upload.single('file'), addTestimonial);   // Add new testimonial
router.get('/testimonials', protect, checkAdmin, getAllTestimonial);         // Get all testimonials (admin only)
router.get('/testimonials/approved', getApprovedTestimonials); // Get only approved testimonials
router.put('/testimonials/:id/approve', protect, checkAdmin, approveTestimonial); // Approve testimonial
router.delete('/testimonials/:id', protect, checkAdmin, deleteTestimonial); // Delete testimonial (admin only)

module.exports = router;
