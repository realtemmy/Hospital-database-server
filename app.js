const express = require("express");
const dotenv = require("dotenv");

const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "./config.env" });

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(compression());

module.exports = app;
