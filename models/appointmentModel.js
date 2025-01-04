const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true, // Patient must be specified for the appointment
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Physician",
      required: true, // Doctor must be specified for the appointment
    },
    date: {
      type: Date,
      required: true, // Appointment date is mandatory
    },
    timeSlot: {
      type: String,
      required: true, // Time slot for the appointment (e.g., "10:30 AM - 11:00 AM")
    },
    reason: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "No-show"],
      default: "Scheduled",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tracks the admin/doctor/nurse who created the appointment
    },
    notes: {
      type: String,
      required: false, // Optional notes about the appointment
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
