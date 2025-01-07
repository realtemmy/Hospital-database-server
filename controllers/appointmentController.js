const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointmentModel");
const MedicalHistory = require("./../models/medicalHistory");
const AppError = require("./../utils/appError");

const { parse } = require("date-fns");

exports.getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    status: "success",
    length: appointments.length,
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
    length: appointments.length,
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
  const parsedDate = parse(req.body.timeSlot, "hha, MMM do, yyyy", new Date());
  console.log(typeof parsedDate);

  if (isNaN(parsedDate)) {
    throw new AppError("Invalid date format. Use '3am, May 26th, 2025", 400);
  }
  const appointment = await Appointment.create({
    physician: req.body.physician,
    patient: req.body.patient,
    timeSlot: parsedDate,
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

  const history = await MedicalHistory.findOne({
    diagnosis: appointment.diagnosis,
  });
  history.status = "resolved";

  res.status(200).json({
    status: "success",
    data: appointment,
  });
});
