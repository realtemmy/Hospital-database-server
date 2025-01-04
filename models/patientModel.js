const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient must be a user"],
      unique: true,
    },
    bloodType: {
      type: String,
    },
    medicalHistory: [
      {
        condition: String,
        dateDiagnosed: Date,
        status: {
          type: String,
          enum: {
            values: ["ongoing", "resolved"],
            message: "{VALUE} is not supported",
          },
          default: "ongoing",
        },
        resolvedDate: Date,
        assignedDoctor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Physician",
        },
        note: String,
      },
    ],
    bloodGroup: {
      type: String,
      enum: ["A", "B", "AB", "O"],
    },
    genotype: {
      type: String,
      enum: ["AA", "AS", "AC", "SS", "CC", "SC"],
    },
    allergies: [String],
    medications: [
      {
        name: String,
        dosage: String,
        startDate: Date,
        endDate: Date,
        assignedPhysician: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Physician",
        },
        note: String,
      },
    ],
    //   treatmentPlan
    testResults: [
      {
        title: String,
        image: String,
        date: Date,
        hospital: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hospital",
        },
        physician: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //A radiologist or lab scientist here
      },
    ],
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
    surgeries: [
      {
        surgeryType: String,
        leadSurgeon: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Doctor/Surgeon
        },
        otherPhysicians: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            role: String, //Eg first assistant, nurse, aeste..(that put you to sleep sha)
          },
        ],
        startDate: Date,
        endDate: Date,
      },
    ],
    insurance: {
      name: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
