const asyncHandler = require("express-async-handler");
const Diagnosis = require("./../models/diagnosisModel");

exports.createDiagnosis = asyncHandler(async (req, res) => {
  const diagnosis = await Diagnosis.create({
    patient: req.body.patientId,
    doctor: req.user.id,
    appointment: req.body.appointment,
    symptoms: req.body.symptoms,
    notes: req.body.notes,
    treatments: req.body.treatment, // set an object in treatment
  });

  res.status(201).json({
    status: "success",
    data: diagnosis,
  });
});
