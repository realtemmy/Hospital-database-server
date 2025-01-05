const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointmentModel");
const MedicalHistory = require("./../models/medicalHistory");

exports.getAllAppointments = asyncHandler(async (req, res) => {
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

exports.getAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: appointment,
  });
});

exports.createAppointment = asyncHandler(async (req, res) => {
  //admin
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

exports.completeAppointment = asyncHandler(async (req, res, next) => {
  // Doctor runs disgnosis and orders test if need be
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      status: "completed",
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const history = await MedicalHistory.findOne({ diagnosis: appointment.diagnosis });
  history.status = "resolved"


  res.status(200).json({
    status: "success",
    data: appointment,
  });
});
