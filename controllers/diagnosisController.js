const asyncHandler = require("express-async-handler");
const Diagnosis = require("./../models/diagnosisModel");
const MedicalHistory = require("./../models/medicalHistory");
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

  res.status(201).json({
    status: "success",
    data: diagnosis,
  });
});

exports.getDiagnosis = asyncHandler(async (req, res) => {
  const diagnosis = await Diagnosis.findById(req.params.diagnosisId);
  res.status(200).json({
    status: "success",
    data: diagnosis,
  });
});

exports.getUserDiagnosis = asyncHandler(async (req, res) => {
  const diagnosis = await Diagnosis.find({ patient: req.body.patientId }); //more of user's id
  res.status(200).json({
    status: "success",
    length: diagnosis.length,
    data: diagnosis,
  });
});

exports.getLoggedInUserDiagnosis = asyncHandler(async (req, res) => {
  const diagnosis = await Diagnosis.find({ patient: req.user.id });
  res.status(200).json({
    status: "success",
    data: diagnosis,
  });
});

exports.updateDiagnosis = asyncHandler(async (req, res) => {
  const diagnosis = await Diagnosis.findByIdAndUpdate(
    req.params.diagnosisId,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: diagnosis,
  });
});

exports.deleteDiagnosis = asyncHandler(async (req, res) => {
  // Only the doctor that created can delete
  await Diagnosis.findByIdAndDelete(req.params.diagnosisId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
