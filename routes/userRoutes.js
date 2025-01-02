const express = require("express");
const authController = require("./../controllers/authControllers");
const userController = require("./../controllers/");

const router = express.Router();

router.post("/auth/signup", authController.signUp);
router.post("/auth/login", authController.login);
router.post("/auth/google", authController.googleAuth);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password/:token", authController.resetPassword);

router
  .route("/:id")
  .get(authController.protect, userController.getUser)
  .delete(authController.protect, authController.restrictTo("Physician", "Admin"));

module.exports = router;
