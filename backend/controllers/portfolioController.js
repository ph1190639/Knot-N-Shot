const Portfolio = require("../models/portfolioModel");
const s3 = require('../config/awsConfig');
const {uploadFileToS3} = require('../middleware/upload');


const addPortfolioItem = async (req, res) => {
  try {
    console.log("Request received. Body:", req.body);
    console.log("File received:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload file to AWS S3
    const { fileUrl } = await uploadFileToS3(req.file);

    // Get form data
    const { customerName, description, category } = req.body;

    // Save to MongoDB
    const newPortfolioItem = new Portfolio({
      customerName,
      description,
      category,
      imageUrl: fileUrl, // Use S3 URL
    });

    await newPortfolioItem.save();
    res.status(201).json({ message: "Portfolio item added", portfolio: newPortfolioItem });
  } catch (error) {
    console.error("Error uploading portfolio item:", error);
    res.status(500).json({ error: error.message });
  }
};



// Get all portfolio items
const getAllPortfolioItems = async (req, res) => {
  try {
    const portfolio = await Portfolio.find();
    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Error fetching portfolio", error: error.message });
  }
}; 
// Get a single portfolio item by ID
const getPortfolioItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const portfolioItem = await Portfolio.findById(id);

    if (!portfolioItem) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    res.status(200).json(portfolioItem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching portfolio item", error: error.message });
  }
};

// Delete a portfolio item by ID
const deletePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Portfolio.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    res.status(200).json({ message: "Portfolio item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting portfolio item", error: error.message });
  }
};

module.exports = {
  addPortfolioItem,
  getAllPortfolioItems,
  getPortfolioItemById,
  deletePortfolioItem,
};
 