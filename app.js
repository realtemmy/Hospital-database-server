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
// doctor prescribes treatment
// patient is treated

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(compression());

module.exports = app;
