const express = require("express");
const authController = require("./../controllers/authControllers");
const testController = require("./../controllers/testController");

const router = express.Router({ mergeParams: true });

router.get("/user", authController.protect, testController.getUserTests);

router
  .route("/")
  .get(testController.getAllTests)
  .post(authController.protect, authController.restrictTo("Physician"), testController.createTest);

module.exports = router;
