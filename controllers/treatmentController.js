const asyncHandler = require("express-async-handler");
const Treatment = require("../models/treatmentModel");
const AppError = require("../utils/appError");

exports.getAllTreatments = asyncHandler(async (req, res, next) => {
  const treatments = await Treatment.find();
  res.status(200).json({
    status: "success",
    data: treatments,
  });
});

exports.getUserTreatments = asyncHandler(async (req, res, next) => {
  const treatments = await Treatment.find({ patient: req.user.id });
  res.status(200).json({
    status: "success",
    data: treatments,
  });
});

exports.createtreatment = asyncHandler(async (req, res) => {
  const diagnosisId = req.params.diagnosisId || req.body.diagnosis;
  console.log(diagnosisId);
  
  const treatment = await Treatment.create({
    patient: req.body.patient,
    physician: req.user._id,
    plan:req.body.plan,
    diagnosis: diagnosisId,
    dosage: req.body.dosage,
    frequency: req.body.freq,
    details: req.body.details,
    sideEffects: req.body.sideEffects,
    type: req.body.type,
    surgery: req.body.surgery,
    note: req.body.note,
  });
  res.status(201).json({
    status: "success",
    data: treatment,
  });
});
