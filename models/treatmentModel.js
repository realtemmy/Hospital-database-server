const mongoose = require("mongoose");
const AppError = require("../utils/appError");

const treatmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient must be specified for the treatment"],
    },

    physician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Physician",
      required: [true, "Doctor must be specified for the treatment"],
    },
    type: {
      type: String,
      enum: {
        values: ["in-patient", "out-patient"],
        message: "Supported treatment types include: In and Out patients",
      },
      default: "out-patient",
    },
    plan: {
      type: String,
      required: [true, "Treatment plan is mandatory"],
    },
    diagnosis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Diagnosis",
      required: [true, "Diagnosis must be specified for the treatment"],
    },
    mode: {
      type: String,
      enum: {
        values: ["medication", "surgery", "therapy", "counselling"],
        message:
          "Treatment type must be either medication, surgery, therapy or counselling",
      },
      default: "medication",
    },
    dosage: { type: String },
    frequency: { type: String },
    details: { type: String, required: true },
    sideEffects: [String],
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    // If mode is surgery, then surgery details must be provided, also add scheduled date etc
    surgery: [
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

    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// check if user is a verified surgeon or doctor

// treatmentSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: ""
//   });
// });
// treatmentSchema.pre("save", function (next) {
//   // if mode is surgery, then surgery details must be provided
//   if (this.mode === "surgery" && this.surgery.length === 0) {
//     return next(new AppError("Surgery details must be provided", 400));
//   }
//   next();
// });

const Treatment = mongoose.model("Treatment", treatmentSchema);

module.exports = Treatment;
