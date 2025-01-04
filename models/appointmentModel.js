const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient must be specified for the appointment"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Physician",
      required: [true, "Doctor must be specified for the appointment"], //
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot for appointment is required."], // Time slot for the appointment (e.g., "10:30 AM - 11:00 AM")
    },
    status: {
      type: String,
      enum: {
        values: ["scheduled", "completed", "cancelled", "no-show"],
        message: "{VALUE} is not supported",
      },
      default: "scheduled",
    },
    diagnosis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Diagnosis",
      required: [true, "Diagnosis must be specified for the appointment"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tracks the admin/doctor/nurse who created the appointment
      required: [true, "Creator of the appointment must be specified"],
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

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
