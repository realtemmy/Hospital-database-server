const express = require("express-async-handler");
const authController = require("./../controllers/authControllers");
const patientController = require("./../controllers/patientController");

const router = express.Router();

router.get(
  "/patient",
  authController.protect,
  patientController.getPatientByUserId
);

router.route("/").get(patientController.getAllPatients);

router
  .route("/:id")
  .get(authController.protect, patientController.getPatientById)
  .patch(
    authController.protect,
    authController.restrictTo("Admin", "Physician"),
    patientController.updatePatient
  );

module.exports = router;
