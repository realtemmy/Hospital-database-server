const express = require("express");
const diagnosisRoutes = require("./diagnosisRoutes");

const authController = require("./../controllers/authControllers");
const appointmentController = require("./../controllers/appointmentController");

const router = express.Router();

router.use("/:appointmentId/diagnosis", diagnosisRoutes);

router.get(
  "/user",
  authController.protect,
  appointmentController.getUserAppointments
);

router.patch(
  "/:id/complete",
  authController.protect,
  authController.restrictTo("Physician"),
  appointmentController.completeAppointment
);

router
  .route("/")
  .get(appointmentController.getAllAppointments)
  .post(
    authController.protect,
    authController.restrictTo("Admin", "Patient"),
    appointmentController.createAppointment
  );

//   Only physician and admin should be able to edit
router.route("/:id").get(appointmentController.getAppointment);
//   .patch(
//     authController.protect,
//     authController.restrictTo("Physician"),
//     appointmentController.completeAppointment()
//   );

module.exports = router;
