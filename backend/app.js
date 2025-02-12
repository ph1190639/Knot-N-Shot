const express = require('express');
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");

const connectMongoDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const portfolioRoutes = require("./routes/portfolioRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");

dotenv.config()

const app = express();

// Middleware  
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set("view engine", "ejs");
// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));  // To parse form data
app.use((req, res, next) => {
  req.setTimeout(120000); // 2 minutes
  res.setTimeout(120000); // 2 minutes
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/users", bookingRoutes);
app.use("/api/users", portfolioRoutes);
app.use("/api/users", testimonialRoutes);
//Call the connectMongoDB function to connect to the database
connectMongoDB();
 
// Error Handling Middleware
app.use((err, req, res, next)=>{
  console.error(err.stack);
  res.status(500).json({error: "something went wrong!"})
});


const PORT = process.env.PORT || 5001; 
app.listen(PORT, ()=>{
  console.log(`app is running on localhost:${PORT}`)
});