const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient must be specified for the treatment"],
    },
    physician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Physician",
      required: [true, "Doctor must be specified for the treatment"],
    },
    name: {
      type: String,
      required: [true, "Treatment name is mandatory"],
    },
    type: {
      type: String,
      enum: ["medication", "surgery", "therapy"],
      default: "medication",
    },
    dosage: { type: String },
    frequency: { type: String },
    details: { type: String, required: true },
    sideEffects: [String],
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Treatment = mongoose.model("Treatment", treatmentSchema);

module.exports = Treatment;
