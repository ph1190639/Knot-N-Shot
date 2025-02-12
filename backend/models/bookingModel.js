const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
   
  customerName: {type: String, required: true},
  phone: { type: String, required: true },
  eventDate: { type: Date, required: true },
  packageType: { type: String, enum: ["Basic", "Premium", "Deluxe"], required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
