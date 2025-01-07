const express = require("express");
const diagnosisController = require("./../controllers/diagnosisController");
const authController = require("./../controllers/authControllers");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(diagnosisController.getAllDiagnosis)
  .post(
    authController.protect,
    authController.restrictTo("Physician"),
    diagnosisController.createDiagnosis
  );

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrictTo("Physician"),
    diagnosisController.deleteDiagnosis
  );

module.exports = router;
