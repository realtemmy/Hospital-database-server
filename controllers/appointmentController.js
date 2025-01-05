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

exports.createAppointment = asyncHandler(async (req, res) => { //admin
  const appointment = await Appointment.create({
    patient: req.body.patient,
    doctor: req.body.doctor,
    timeSlot: req.body.timeSlot,
    createdBy: req.user.id,
  });
  res.status(201).json({
    status: "success",
    data: appointment,
  });
});

exports.addTestResultToAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  appointment.testResult.push(req.body.testResultId);
  await appointment.save()
});

exports.completeAppointment = asyncHandler(async (req, res, next) => { // Doctor runs disgnosis and orders test if need be
  const appointment 
});

