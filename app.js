const express = require("express");
const dotenv = require("dotenv");

const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "./config.env" });

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// Steps
// appointment is booked by a patient/hospital admin
// appointment is confirmed by the doctor
// patient is diagnosed by the doctor
// under diagnosis, doctor might order a test and based on result of the test gives a treatment plan
// patient is treated
// appointmennt is marked complete does't mean nedical history is complete
// When is medical history complete?
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(compression());

// ================ Routes Middlewares ======================
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const diagnosisRoutes = require("./routes/diagnosisRoutes");
const testRoutes = require("./routes/testRoutes");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/diagnosis", diagnosisRoutes);
app.use("/api/v1/test", testRoutes);

// ================= All undefined routes ===================
app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
