const asyncHandler = require("express-async-handler");
const Diagnosis = require("./../models/diagnosisModel");
const MedicalHistory = require("./../models/medicalHistory");
const Treatment = require("./../models/treatmentModel");
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

exports.registerTreatment = asyncHandler(async (req, res, next) => {
  const treatment = await Treatment.create({
    patient: req.body.patient,
    physician: req.user._id,
    name: req.body.name,
    dosage: req.body.dosage,
    frequency: req.body.freq,
    details: req.body.details,
    sideEffects: req.body.sideEffects,
    type: req.body.type,
    notes: req.body.notes,
  });

  await Diagnosis.findByIdAndUpdate(
    req.params.diagnosisId,
    {
      $push: {
        treatments: treatment._id,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
});

exports.deleteDiagnosis = asyncHandler(async (req, res, next) => {
  // Only the doctor that created can delete
  await Diagnosis.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
