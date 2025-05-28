const express = require("express");
const authController = require("./../controllers/authControllers");
const physicianController = require("./../controllers/physicianController");

const router = express.Router();



router
  .route("/")
  .get(physicianController.getAllPhysicians)
  .post(authController.protect, physicianController.createPhysician);

router
  .route("/:physicianId")
  .get(physicianController.getPhysician)
  .patch(physicianController.updatePhysician)
  .delete(authController.protect, physicianController.deletePhysician);

module.exports = router;
