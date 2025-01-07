const asyncHandler = require("express-async-handler");
const Diagnosis = require("./../models/diagnosisModel");
const MedicalHistory = require("./../models/medicalHistory");
const Treatment = require("./../models/treatmentModel");

exports.createDiagnosis = asyncHandler(async (req, res) => {
  const appointmentId = req.params.appointmentId || req.body.appointmentId;
  const diagnosis = await Diagnosis.create({
    patient: req.body.patientId,
    doctor: req.user.id,
    appointment: appointmentId,
    symptoms: req.body.symptoms,
    notes: req.body.notes, // set an object in treatment
  });

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
