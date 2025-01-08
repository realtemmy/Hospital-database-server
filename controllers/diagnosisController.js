const asyncHandler = require("express-async-handler");
const Diagnosis = require("./../models/diagnosisModel");
const MedicalHistory = require("./../models/medicalHistory");
const Appointment = require("./../models/appointmentModel");
const AppError = require("./../utils/appError");

exports.getAllDiagnosis = asyncHandler(async (req, res) => {
  const diagnosis = await Diagnosis.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: "success",
    results: diagnosis.length,
    data: diagnosis,
  });
});

exports.createDiagnosis = asyncHandler(async (req, res) => {
  const appointmentId = req.params.appointmentId || req.body.appointmentId;

  const diagnosis = await Diagnosis.create({
    patient: req.body.patient,
    physician: req.user.id,
    appointment: appointmentId,
    symptoms: req.body.symptoms,
    note: req.body.note,
  });

  // When deleting an appointment, the diagnosis should also be deleted
  await MedicalHistory.create({
    patient: req.body.patient,
    diagnosis: diagnosis._id,
    status: "ongoing",
  });
  await Appointment.findByIdAndUpdate(
    appointmentId,
    {
      diagnosis: diagnosis._id,
    },
    { new: true, runValidators: true }
  );

  res.status(201).json({
    status: "success",
    data: diagnosis,
  });
});



exports.deleteDiagnosis = asyncHandler(async (req, res, next) => {
  // Only the doctor that created can delete
  await Diagnosis.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
