const express = require("express");
const diagnosisRoutes = require("./diagnosisRoutes");
const testRoutes = require("./testRoutes");

const authController = require("./../controllers/authControllers");
const appointmentController = require("./../controllers/appointmentController");

const router = express.Router();

router.use("/:appointmentId/test", testRoutes);
router.use("/:appointmentId/diagnosis", diagnosisRoutes);

//  ============== Steps ================= //
// 1. Create a new appointment
// 2. Admin confirms and appoint doctor to the appointment
// 3. Doctor completes the appointment
// 4. User cancelles the appointment
// 5. User does not show up for the appointment
// 6. User reschedules the appointment

router.route("/:appointmentId").get(appointmentController.getAppointment)

router.get(
  "/user",
  authController.protect,
  appointmentController.getUserAppointments
);

router.get(
  "/me",
  authController.protect,
  appointmentController.getLoggedInUserAppointments
);

router.route("/").get(appointmentController.getAllAppointments).post(
  authController.protect,
  appointmentController.createAppointment
);

router.patch(
  "/:id/confirm",
  authController.protect,
  authController.restrictTo("Admin"),
  appointmentController.confirmAppointment
);

router.patch(
  "/:id/complete",
  authController.protect,
  authController.restrictTo("Physician"),
  appointmentController.completeAppointment
);

router.patch("/:id/cancel", appointmentController.cancelAppointment);
router.patch(
  "/:id/reschedule",
  authController.restrictTo("Admin", "Patient"),
  appointmentController.rescheduleAppointment
);

module.exports = router;
