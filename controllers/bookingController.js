const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

const userBooking = async(req, res) => {
  
  const {customerName, email, phone, eventDate, packageType, location } = req.body;
  
  if(!customerName || !phone || !eventDate || !packageType || !location){
    return res.status(400).json({
      message: 'please provide all fields!'
    });
  };
  

  // Validate phone number format
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Invalid phone number format.' });
  }

  // Validate event date (must be in the future)
  if (new Date(eventDate) < new Date()) {
    return res.status(400).json({ message: 'Event date must be in the future' });
  }
  

  try{
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    const existingBooking = await Booking.findOne({ email, eventDate });
    if(existingBooking){
      return res.status(400).json({message: 'You already booked the event'});
    };

    const booking = await Booking.create({
      customerName,
      email,
      phone,
      eventDate,
      packageType,
      location,
      userId: req.user.id,
    });
    res.status(201).json({ message: 'Booking successful', booking });


  }catch(error){
    return res.status(500).json({
      message: 'error booking event', error: error.message
    })
  }  

}; 

const getAllBookings = async(req, res) => {
  
  try{
    const bookings = await Booking.find(); 
    if(bookings.length === 0){
      return res.status(400).json({message: 'No booking found'});
    }
    res.status(200).json(bookings);
  }catch(error){
    return res.status(500).json({
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

const getBookingById = async(req, res) => {

  try{
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
      res.status(500).json({
        message: 'Error fetching booking',
        error: error.message,
      });
    }

};

const updateBooking = async (req, res) => {
  
  const { id } = req.params;
  
  const { customerName, phone, eventDate, packageType, location } = req.body;

  try {
    // Find the booking by ID
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }



   // Check if the user is the owner of the booking or an admin
   const isOwner = booking.userId.toString() === req.user.id.toString(); // Compare ObjectId as string
    const isAdmin = req.user.role === 'Admin'; 

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied. You do not have permission to update this booking.' });
    }


    // Update the booking
    if (customerName) booking.customerName = customerName;
    if (phone) booking.phone = phone;
    if (eventDate) booking.eventDate = eventDate;
    if (packageType) booking.packageType = packageType;
    if (location) booking.location = location;

    await booking.save();

    res.status(200).json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};


const cancelBooking = async (req, res) => {
  try {
     
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user is the owner of the booking or an admin
   const isOwner = deletedBooking.userId.toString() === req.user.id.toString(); // Compare ObjectId as string
   const isAdmin = req.user.role === 'Admin'; 

   if (!isOwner && !isAdmin) {
     return res.status(403).json({ message: 'Access denied. You do not have permission to update this booking.' });
   }

    res.status(200).json({ message: 'Booking canceled successfully', deletedBooking });
  } catch (error) {
    res.status(500).json({
      message: 'Error canceling booking',
      error: error.message,
    });
  }
};


module.exports = { userBooking, getAllBookings, getBookingById, updateBooking, cancelBooking }