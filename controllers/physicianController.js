const asyncHandler = require("express-async-handler");
const Physician = require("./../models/physicianModel");

exports.getAllPhysicians = asyncHandler(async (req, res) => {
  const physicians = await Physician.find();
  res.status(200).json({
    status: "success",
    results: physicians.length,
    data: physicians,
  });
});

exports.getPhysician = asyncHandler(async (req, res, next) => {
  const physician = await Physician.findById(req.params.physicianId);
  if (!physician) {
    return next("No physician with ID found", 404);
  }

  res.status(200).json({
    status: "success",
    data: physician,
  });
});

exports.updatePhysician = asyncHandler(async (req, res, next) => {
  const physician = await Physician.findByIdAndUpdate(
    req.params.physicianId,
    req.body,
    { new: true, runValidators: true }
  );

  if (!physician) {
    return next("No physician with ID found", 404);
  }

  res.status(200).json({
    status: "success",
    data: physician,
  });
});

exports.deletePhysician = asyncHandler(async (req, res) => {
  await Physician.findByIdAndDelete(req.params.physicianId);
  res.status(204).json({
    status: success,
    data: null,
  });
});
