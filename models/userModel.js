const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Patient must have a first name"],
  },
  lastName: {
    type: String,
    required: [true, "Patient must have a last name"],
  },
  email: {
    type: String,
    required: [true, "User should have an email"],
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female"],
      message: "{value} for gender is not supported",
    },
    required: [true, "Patient must provide gender"],
  },
  dateOfBirth: {
    type: Date,
  },
  socials: [
    {
      type: String,
    },
  ],
  //   Maybe add up to 2 or 3 emergency contacts
  emergencyContact: {
    name: {
      type: String,
    },
    relationship: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
