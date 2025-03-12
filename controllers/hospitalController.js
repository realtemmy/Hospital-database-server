const asyncHandler = require("express-async-handler");

const Hospital = require("./../models/hospitalModel");
const Laboratory = require("./../models/laboratoryModel");

exports.getAllHospitals = asyncHandler(async (req, res, next) => {
  const hospitals = await Hospital.find();

  res.status(200).json({
    status: "success",
    results: hospitals.length,
    data: hospitals,
  });
});

exports.getHospitalById = asyncHandler(async (req, res, next) => {
  const hospital = await Hospital.findById(req.params.id);

  if (!hospital) {
    return next(new Error("No hospital with ID found"));
  }

  res.status(200).json({
    status: "success",
    data: hospital,
  });
});

exports.createHospital = asyncHandler(async (req, res, next) => {
  const hospital = await Hospital.create({
    name: req.body.name,
    address: req.body.address,
    laboratories: req.body.laboratories,
    phone: req.body.phone,
    email: req.body.email,
    website: req.body.website,
    // Array of laboratories associated with the hospital
  });

  res.status(201).json({
    status: "success",
    data: hospital,
  });
});

exports.addRoomsToHospital = asyncHandler(async (req, res, next) => {
  // rooom - roomNumber, type, capacity
  const hospital = await Hospital.findByIdAndUpdate(
    req.params.hospitalId,
    {
      $push: {
        rooms: {
          roomNumber: req.body.roomNumber,
          roomType: req.body.roomType,
          capacity: req.body.capacity,
        },
      },
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: hospital,
  });
});

exports.assignRoom = asyncHandler(async (req, res, next) => {
  const hospital = await Hospital.findOne({
    _id: req.params.id,
    rooms: { $elemMatch: { roomNumber: req.body.roomNumber } },
  });
  res.status(200).json({
    status: "success",
    data: hospital,
  });
});

exports.unassignRoom = asyncHandler(async (req, res, next) => {
  const hospital = await Hospital.find({ _id: req.params.id, rooms: {  } });
  res.status(200).json({
    status: "success",
    data: hospital,
  });
});
