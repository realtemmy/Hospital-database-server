const mongoose = require("mongoose");
const Physician = require("./physicianModel");
const AppError = require("./../utils/appError");

const testSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Patient is required"],
  },
  physician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Radiologist or lab scientist only
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
    required: [true, "Category is required for tests"],
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
  // for now, confirm user is a physician
  const string = this.physician.toString();
  const physician = Physician.findOne({ user: string });
  if (!physician) {
    return next(new AppError("User is not a physician", 401));
  }

  next();
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
