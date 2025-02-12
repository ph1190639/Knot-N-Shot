const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  review: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  photoUrl: {
    type: String, // URL of the uploaded image
  },
  approved: {
    type: Boolean,
    default: false, // Admin must approve before displaying
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Testimonial", TestimonialSchema);
