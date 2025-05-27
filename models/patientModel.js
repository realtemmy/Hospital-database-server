const mongoose = require("mongoose");

// virtual populate medical history
const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient must be an existing user"],
      unique: true,
    },
    bloodType: {
      type: String,
    },
    bloodGroup: {
      type: String,
      enum: ["A", "B", "AB", "O"],
    },
    genotype: {
      type: String,
      enum: ["AA", "AS", "AC", "SS", "CC", "SC"],
    },
    allergies: [String],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    rhFactor: {
      type: Boolean,
      default: false,
    },
    insurance: {
      name: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

patientSchema.virtual("medicalHistory", {
  ref: "MedicalHistory",
  foreignField: "patient",
  localField: "_id",
});

patientSchema.pre(/^find/, function(next) {
  this.populate({
    path:"user",
    select: "email photo firstName lastName"
  })
  next()
})

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
