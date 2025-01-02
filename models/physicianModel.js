const mongoose = require("mongoose");

const physicianSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Physician must be a user"],
  },
  specialization: {
    type: String,
    enum: {
      values: ["Doctor", "Pharmacist", "Radiologist", "Nurse"],
      message: "{VALUE} is not supported as a specialization",
    },
  },
  qualifications: [String], // eg MBBS, MD, PhD
  department: {
    type: String, // eg cardiology, radiology
  },
  licenseNumber: {
    type: Number,
    required: [true, "License number is required."],
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
});

const Physician = mongoose.model("Physician", physicianSchema);

module.exports = Physician;
