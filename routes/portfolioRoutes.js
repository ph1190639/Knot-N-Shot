const express= require('express');
const { protect, checkAdmin } = require('../middleware/authMiddleware');
const router = express.Router();
const {
  addPortfolioItem,
  getAllPortfolioItems,
  getPortfolioItemById,
  deletePortfolioItem,
} = require("../controllers/portfolioController");
const {upload} = require('../middleware/upload');



//portfolio routes
router.post("/portfolio",upload.single('file'),  protect, checkAdmin, addPortfolioItem
);
 

router.get('/portfolio', getAllPortfolioItems);
router.get("/portfolio/:id", getPortfolioItemById);
router.delete('/portfolio/:id', checkAdmin, deletePortfolioItem);

module.exports = router;