const express = require("express");
const authController = require("./../controllers/authControllers");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/auth/signup", authController.signUp);
router.post("/auth/login", authController.login);
router.post("/auth/google", authController.googleAuth);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password/:token", authController.resetPassword);

router.route("/").get(userController.getAllUsers);

router.route("/me").get(authController.protect, userController.getMe);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(
    authController.protect,
    authController.restrictTo("Admin"),
    userController.deleteUser
  );

module.exports = router;
