const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointmentModel");
const MedicalHistory = require("./../models/medicalHistory");
const AppError = require("./../utils/appError");

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
    patient: req.params.patientId, // pass userId as patientId
  });
  res.status(200).json({
    status: "success",
    length: appointments.length,
    data: appointments,
  });
});

exports.getLoggedInUserAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id });
  res.status(200).json({
    status: "success",
    length: appointments.length,
    data: appointments,
  });
});

exports.getAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.appointmentId);
  res.status(200).json({
    status: "success",
    data: appointment,
  });
});

exports.createAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.create({
    physician: req.body.physicianId,
    patient: req.body.patientId,
    timeSlot: req.body.time,
    date: req.body.date,
    type: req.body.appointmentType,
    createdBy: req.user.id,
    notes: req.body.notes,
  });

  res.status(201).json({
    status: "success",
    data: appointment,
  });
});

exports.confirmAppointment = asyncHandler(async (req, res, next) => {
  //admin
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      status: "confirmed",
      timeSlot: req.body.timeSlot,
      physician: req.body.physician,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  // after appointment is set, send email or sms to patient

  res.status(200).json({
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

  res.status(200).json({
    status: "success",
    data: appointment,
  });
});

// User cancels appointment
exports.cancelAppointment = asyncHandler(async (req, res, next) => {
  // Confirm if user is the one who created the appointment
  const app = await Appointment.findById(req.params.id);
  if (app.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError("You are not allowed to cancel this appointment", 401)
    );
  }
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      status: "cancelled",
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // Send email or sms to patient

  res.status(200).json({
    status: "success",
    data: appointment,
  });
});

exports.rescheduleAppointment = asyncHandler(async (req, res, next) => {
  if (app.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError("You are not allowed to cancel this appointment", 401)
    );
  }
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      timeSlot: req.body.timeSlot,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: appointment,
  });
});
