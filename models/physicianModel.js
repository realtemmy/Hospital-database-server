const mongoose = require("mongoose");

const physicianSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Physician must be a user"],
    unique: true,
  },
  specialization: {
    type: String,
    enum: {
      values: ["Doctor", "Pharmacist", "Radiologist", "Nurse"],
      message: "{VALUE} is not supported as a specialization",
    },
    default: "Doctor",
  },
  qualifications: [String], // eg MBBS, MD, PhD
  department: {
    type: String, // eg cardiology, radiology
  },
  licenseNumber: {
    type: Number,
    required: [true, "License number is required."],
    unique: true,
    minLength: [5, "License number must be at least 5 characters long."],
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
});

physicianSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "email photo firstName lastName",
  });
  next();
});

physicianSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "email photo firstName lastName",
  })
  next();
})

const Physician = mongoose.model("Physician", physicianSchema);

module.exports = Physician;
