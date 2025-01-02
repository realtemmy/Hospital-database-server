const asyncHandler = require("express-async-handler");
const Patient = require("./../models/patientModel");

exports.getPatientById = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    return next(new Error("No Patient with ID found"));
  }
});

exports.getPatientByUserId = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) {
    return next(new Error("No patient with ID found"));
  }

  res.status(200).json({
    status: "success",
    data: patient,
  });
});

exports.updatePatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: patient,
  });
});
