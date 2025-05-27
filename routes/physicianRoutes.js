const express = require("express");
const authController = require("./../controllers/authControllers");
const physicianController = require("./../controllers/physicianController");


const router = express.Router();

router.route("/").get(physicianController.getAllPhysicians)






module.exports = router