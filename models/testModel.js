const mongoose = require("mongoose");

const TestResults = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: [true, "Patient is required"],
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Physician", // Radiologist or lab scientist only
    required: [true, "Physician is required"],
  },
  name: {
    type: String,
    required: [true, "Test name is required"],
  },
  category: {
    type: String, // eg Blood chemistry, hematology, microbiology, immunology,
    required: [true, "Category is required"],
  },
  resultValue: {
    type: String,
  },
  interpretation: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("TestResults", TestResults);
