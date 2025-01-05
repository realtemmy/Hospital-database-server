const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointmentModel");

exports.getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({});
  res.status(200).json({
    status: "success",
    data: appointments,
  });
});

exports.getUserAppointments = asyncHandler(async (req, res) => {
  // Get patientId from userId
  const appointments = await Appointment.find({
    patient: req.params.patientId,
  });
  res.status(200).json({
    status: "success",
    data: appointments,
  });
});

exports.createAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.create({
    patient: req.body.patient,
    doctor: req.body.doctor,
    timeSlot: req.body.timeSlot,
    diagnosis: req.body.diagnosis,
    createdBy: req.body.createdBy,
    notes: req.body.notes,
  });
  res.status(201).json({
    status: "success",
    data: appointment,
  });
});

