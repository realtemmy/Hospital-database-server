const asyncHandler = require("express-async-handler");
const Test = require("./../models/testModel");
const Appointment = require("./../models/appointmentModel");

exports.getAllTests = asyncHandler(async (req, res) => {
  const tests = await TestResults.find();
  res.status(200).json({
    status: "success",
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
  const test = await Test.create({
    patient: req.body.patient,
    doctor: req.user._id,
    category: req.body.category,
    name: req.body.name,
    resultValue: req.body.resultValue,
    image: req.body.image,
    interpretation: req.body.interpretation,
    appointment: req.params.appointmentId,
  });

  await Appointment.findByIdAndUpdate(req.params.appointmentId, {
    $push: {
      testResults: test._id,
    },
  });

  res.status(201).json({
    status: "success",
    data: test,
  });
});
