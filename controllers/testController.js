const asyncHandler = require("express-async-handler");
const Test = require("./../models/testModel");
const Appointment = require("./../models/appointmentModel");

exports.getAllTests = asyncHandler(async (req, res) => {
  const tests = await Test.find();
  res.status(200).json({
    status: "success",
    length: tests.length,
    data: tests,
  });
});

exports.getUserTests = asyncHandler(async (req, res) => {
  const tests = await Test.find({ patient: req.params.patientId });
  res.status(200).json({
    status: "success",
    data: tests,
  });
});

exports.createTest = asyncHandler(async (req, res) => {
  const appointmentId = req.params.appointmentId || req.body.appointment;
  const test = await Test.create({
    patient: req.body.patient,
    physician: req.user._id,
    category: req.body.category,
    name: req.body.name,
    resultValue: req.body.resultValue,
    image: req.body.image,
    interpretation: req.body.interpretation,
    appointment: appointmentId,
  });


  res.status(201).json({
    status: "success",
    data: test,
  });
});
