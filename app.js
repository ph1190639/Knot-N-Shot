const express = require('express');
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");

const connectMongoDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config()

const app = express();

// Middleware 
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/users", userRoutes);


//Call the connectMongoDB function to connect to the database
connectMongoDB();

// Error Handling Middleware
app.use((err, req, res, next)=>{
  console.error(err.stack);
  res.status(500).json({error: "something went wrong!"})
});


const PORT = process.env.PORT; 
app.listen(PORT, ()=>{
  console.log(`app is running on localhost:${PORT}`)
});