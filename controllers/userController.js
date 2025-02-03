 const User = require('../models/userModel');
 const jwt = require("jsonwebtoken");
 const bcrypt = require('bcryptjs');


 const createAdmin = async (req, res) => {
  const { name, phone, email, password } =  req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email, and password." });
  }

  try {
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Set a strong password

    const admin = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      role: "Admin", // Manually assign admin role
    });

    res.status(201).json({
      message: "Admin created successfully.",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating admin.",
      error: error.message,
    });
  }
};

const registerUser = async(req, res) => {
  const { name, phone, email, password, role } =  req.body;

  if(!name || !phone || !email || !password){
    return res.status(400).json({message: " please provide all feilds"})
  }
  try{
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message: "user already exists!"})
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
 
    const user = await User.create({
      name, phone, email, password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role
      }, 
    });

  }catch(error){
    res.status(500).json({
      message: 'Error registering user.', error: error.message
    });
  }
};


const loginUser = async(req, res) => {
  const {email, password} = req.body;
  if(!email || !password){
    return res.status(401).json({
      message: 'Please provide all required fields.'
    })
  }
  try{
    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({
        message: " User not found."
      })
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
 
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({
      id: user._id,
      role: user.role
    }, process.env.JWT_SECRET, {expiresIn: "7d"});

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  }catch(error){
    res.status(500).json({ message: "Error logging in.", error: error.message });
  } 

};

// ✅ Get User Profile (Protected Route)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update User Profile (Protected Route)
const updateUserProfile = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save(); 

    res.json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {createAdmin, registerUser, loginUser, getUserProfile, updateUserProfile};