const express = require("express");
const diagnosisController = require("./../controllers/diagnosisController");
const authController = require("./../controllers/authControllers");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("Physician"),
    diagnosisController.createDiagnosis
  );

module.exports = router;
