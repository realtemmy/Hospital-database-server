const asyncHandler = require("express-async-handler");
const AppError = require("./../utils/appError");
const Hospital = require("./../models/hospitalModel");

exports.getAllHospitals = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find();

  res.status(200).json({
    status: "success",
    results: hospitals.length,
    data: hospitals,
  });
});

exports.getHospital = asyncHandler(async (req, res, next) => {
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
  if (!req.params.hospitalId) {
    return next(new AppError("No hospital ID", 400));
  }
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

  if (!hospital) {
    return next(new AppError("No hospital with ID found", 404));
  }

  res.status(200).json({
    status: "success",
    data: hospital,
  });
});

exports.removeRoomFromHospital = asyncHandler(async (req, res, next) => {
  const hospital = await Hospital.findByIdAndUpdate(
    req.params.hospitalId,
    {
      $pull: {
        rooms: {
          roomNumber: req.body.roomNumber,
          roomType: req.body.roomType,
          capacity: req.body.capacity,
        },
      },
    },
    { new: true, runValidators: true }
  );

  if (!hospital) {
    return next(new AppError("No hospital with ID found", 404));
  }

  res.status(200).json({
    status: "success",
    data: hospital,
  });
});

exports.assignRoom = asyncHandler(async (req, res, next) => {
  const { roomNumber, patientId } = req.body;
  const hospital = await Hospital.findOneAndUpdate(
    { _id: req.params.hospitalId, "rooms.roomNumber": roomNumber },
    { $push: { "rooms.$.currentPatients": patientId } },
    { new: true }
  );

  if (!hospital) {
    return next(new AppError("No room match found in hospital.", 404)); //Room is already occupied or not found
  }
  res.status(200).json({
    status: "success",
    data: hospital,
  });
});

exports.unassignRoom = asyncHandler(async (req, res, next) => {
  const { roomNumber, patientId } = req.body;
  const hospital = await Hospital.findOneAndUpdate(
    { _id: req.params.hospitalId, "rooms.roomNumber": roomNumber },
    { $pull: { "rooms.$.currentPatients": patientId } },
    { new: true }
  );

  if (!hospital) {
    return next(new AppError("No room matches given info", 401)); //Room is already occupied or not found
  }

  res.status(200).json({
    status: "success",
    data: hospital,
  });
});
