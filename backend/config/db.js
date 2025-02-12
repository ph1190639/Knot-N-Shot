const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config()

const connectMongoDB = async() => {
  try{
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI);
    console.log("connected to mongoDB");
  }catch(error){
    console.error("error connecting to mongoDB", error.message);
    process.exit(1);
  }
  
}
module.exports = connectMongoDB;