const Testimonial = require("../models/testimonialModel");
const { uploadFileToS3 } = require("../middleware/upload"); // Import S3 upload function

// . Add a new testimonial with optional image/video upload
const addTestimonial = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    const { review, rating } = req.body;
    const userId = req.user.id; // Extract user ID from request

    // Validate if review and rating are provided
    if (!review || !rating) {
      return res.status(400).json({ error: "Review and Rating are required!" });
    }

    // Validate that rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5!" });
    }

    // Check if user uploaded a file (image/video)
    let photoUrl = null;
    if (req.file) {
      const uploadedPhoto = await uploadFileToS3(req.file);
      photoUrl = uploadedPhoto.fileUrl;
    }

    // Create new testimonial (await to save in DB)
    const testimonial = await Testimonial.create({
      userId,
      review,
      rating,
      photoUrl,
      approved: false, // Requires admin approval
    });

    res.status(201).json({ message: "Testimonial submitted for approval", testimonial });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 2. Get all testimonials (for admin, includes unapproved)
const getAllTestimonial = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1; // Default to page 1
    limit = parseInt(limit) || 3; // Default to 10 testimonials per page

    const skip = (page - 1) * limit; // Calculate how many documents to skip

    // Get total count of testimonials
    const totalTestimonials = await Testimonial.countDocuments();

    // Fetch testimonials with pagination
    const testimonials = await Testimonial.find()
      .populate("userId", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      totalTestimonials,
      currentPage: page,
      totalPages: Math.ceil(totalTestimonials / limit),
      testimonials,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ 3. Get only approved testimonials (for public display)
const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).populate("userId", "name");
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 4. Admin approves a testimonial
const approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );

    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });

    res.status(200).json({ message: "Testimonial approved", testimonial });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 5. Delete testimonial (admin only)
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });

    await Testimonial.findByIdAndDelete(id);
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addTestimonial,
  getAllTestimonial,
  getApprovedTestimonials,
  approveTestimonial,
  deleteTestimonial,
};
