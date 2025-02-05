const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Pre-Wedding", "Candid", "Traditional", "Reception", "Wedding"],
    required: true,
  },
  description: {
    type: String,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
module.exports = Portfolio;
 