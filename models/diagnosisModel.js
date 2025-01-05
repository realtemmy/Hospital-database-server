const mongoose = require("mongoose");

const diagnosisSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient must be specified for the diagnosis"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Physician",
      required: [true, "Doctor must be specified for the diagnosis"],
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment must be specified for the diagnosis"],
    },
    symptoms: [
      {
        type: String,
      },
    ],
    treatments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Treatment",
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);

module.exports = Diagnosis;
