const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, require: true, unigue: true},
  password: {type: String, required: true},
  role:{type: String, enum:["Admin", "Customer"], default:"Customer"}
}, {timestamps: true});

const User = mongoose.model("user", userSchema);

module.exports = User;