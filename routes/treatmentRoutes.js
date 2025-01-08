const express = require("express");

const authController = require("./../controllers/authControllers");
const treatmentController = require("./../controllers/treatmentController");

const router = express.Router({ mergeParams: true });

router.get(
  "/user",
  authController.protect,
  treatmentController.getUserTreatments
);

router
  .route("/")
  .get(treatmentController.getAllTreatments)
  .post(
    authController.protect,
    authController.restrictTo("Physician"),
    treatmentController.createtreatment
  );

module.exports = router;
