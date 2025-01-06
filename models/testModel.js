const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
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
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: [true, "Appointment is required"],
  },
  category: {
    type: String, // eg Blood chemistry, hematology, microbiology, immunology,
    required: [true, "Category is required"],
  },
  resultValue: {
    type: String,
  },
  image: {
    type: String,
  },
  interpretation: {
    type: String,
    trim: true,
  },
});

testSchema.pre("save", function (next) {
  // if the physician type is not radiologist or lab scientist, throw error
  next();
});

const Test = mongoose.model("TestResults", testSchema);

module.exports = Test;
