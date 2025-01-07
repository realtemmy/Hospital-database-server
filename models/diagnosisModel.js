const mongoose = require("mongoose");
const Physician = require("./physicianModel");
const AppError = require("./../utils/appError");

const diagnosisSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient must be specified for the diagnosis"],
    },
    physician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor must be specified for the diagnosis"],
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment must be specified for the diagnosis"],
    },
    symptoms: [
      {
        type: String,
      },
    ],
    treatments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Treatment",
      },
    ],
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

diagnosisSchema.pre("save", async function (next) {
  // Check if physician exists or is an actual physician
  // Check if specialization is doctor?
  const string = this.physician.toString();
  const physician = await Physician.findOne({ user: string });
  if (!physician) {
    return next(new AppError("User is not a physician", 401));
  }

  next();
});

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);

module.exports = Diagnosis;
