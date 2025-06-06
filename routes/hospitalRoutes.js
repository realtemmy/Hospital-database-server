const express = require("express");
const authController = require("./../controllers/authControllers");
const hospitalController = require("./../controllers/hospitalController");

const router = express.Router();

router
  .route("/")
  .get(hospitalController.getAllHospitals)
  .post(hospitalController.createHospital);


// Check if it's the hospital admin gan gan before allowing to update details
router
  .route("/:hospitalId")
  .get(hospitalController.getHospital)
  .patch(
    authController.protect,
    authController.restrictTo("Admin"),
    hospitalController.updateHospitalDetails
  );

//   Must be an admin associated with the hospital
router.patch(
  "/:hospitalId/add-room",
  authController.protect,
  authController.restrictTo("Admin"),
  hospitalController.addRoomsToHospital
);

router.patch(
  "/:hospitalId/assign-room",
  authController.protect,
  authController.restrictTo("Admin"),
  hospitalController.assignRoom
);
router.patch(
  "/:hospitalId/unassign-room",
  authController.protect,
  authController.restrictTo("Admin"),
  hospitalController.unassignRoom
);

module.exports = router;
