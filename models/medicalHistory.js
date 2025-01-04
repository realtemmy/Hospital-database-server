const mongoose = require("mongoose");

// When diagnosis is completed or started sha, create a medical history for the patient
const medicalHistorySchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Physician",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ongoing", "resolved"],
        message: "{VALUE} is not supported",
      },
      default: "ongoing",
    },
    diagnosis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Diagnosis",
      required: [true, "Diagnosis must be specified"],
    },
    treatment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Treatment",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const MedicalHistory = mongoose.model("MedicalHistory", medicalHistorySchema);

module.exports = MedicalHistory;