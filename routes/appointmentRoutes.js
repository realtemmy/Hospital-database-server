const express = require("express");
const diagnosisRoutes = require("./diagnosisRoutes");
const testRoutes = require("./testRoutes");

const authController = require("./../controllers/authControllers");
const appointmentController = require("./../controllers/appointmentController");

const router = express.Router();


router.use("/:appointmentId/test", testRoutes);
router.use("/:appointmentId/diagnosis", diagnosisRoutes);

// Active appointments
// Edit appointment date
// Cancel appointment as a user and missed appointment after 24 hours of due date

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
