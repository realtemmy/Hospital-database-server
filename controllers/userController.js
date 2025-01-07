const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const AppError = require("./../utils/appError");

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ expire: false });
  res.status(200).json({
    status: "success",
    length: users.length,
    data: users,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new AppError('No document with ID found', 404));
    }
    res.status(200).json({
      status: "success",
      data: user,
    });
})

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("No document with ID found", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  // Update when someone dies
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      expire: true,
    },
    { new: true, runValidators: true }
  );
  if (!user) {
    return; //new error
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});
