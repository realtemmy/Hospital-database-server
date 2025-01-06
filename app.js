const express = require("express");
const dotenv = require("dotenv");

const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "./config.env" });

const app = express();

// Steps
// appointment is booked by a patient/hospital admin
// appointment is confirmed by the doctor
// patient is diagnosed by the doctor
// under diagnosis, doctor might order a test and based on result of the test gives a treatment plan
// patient is treated

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(compression());


// ================ Routes Middlewares ======================


// ================= All undefined routes ===================

app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;

