const mongoose = require("mongoose");

// When diagnosis is completed or started sha, create a medical history for the patient
const medicalHistorySchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patiant data is required for diagnosis"],
    },
    condition: {
      type: String,
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
