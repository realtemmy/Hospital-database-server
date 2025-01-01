const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION, shutting down");
  console.log(err.name, err.message);
  process.exit(1); // Use 1 to indicate an error
});

const app = require("./app");
const PORT = process.env.PORT || 6000;

// MongoDB connection
const DB = process.env.DATABASE_LOCAL;

async function connectToDatabase() {
  try {
    await mongoose.connect(DB);
    console.log("Connected to MongoDB.");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit the process if database connection fails
  }
}

connectToDatabase();

mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error:", err);
});

const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION, shutting down");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
