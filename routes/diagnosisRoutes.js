const express = require("express");
const diagnosisController = require("./../controllers/diagnosisController");
const authController = require("./../controllers/authControllers");

const treatmentRoutes = require("./treatmentRoutes");

const router = express.Router({ mergeParams: true });

router.use("/:diagnosisId/treatment", treatmentRoutes);


router.get("/user", diagnosisController.getUserDiagnosis);

router.get(
  "/me",
  authController.protect,
  diagnosisController.getLoggedInUserDiagnosis
);

router
  .route("/")
  .get(diagnosisController.getAllDiagnosis)
  .post(
    authController.protect,
    authController.restrictTo("Physician"),
    diagnosisController.createDiagnosis
  );

router
  .route("/:diagnosisId")
  .get(diagnosisController.getDiagnosis)
  .patch(
    authController.protect,
    authController.restrictTo("Physician"),
    diagnosisController.updateDiagnosis
  )
  .delete(
    authController.protect,
    authController.restrictTo("Physician"),
    diagnosisController.deleteDiagnosis
  );

module.exports = router;
