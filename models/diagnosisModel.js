const mongoose = require("mongoose");
const { path } = require("../app");

const diagnosisSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient must be specified for the diagnosis"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Physician",
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
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

diagnosisSchema.pre(/^find/, function(){
  return this.populate({
    path: "patient",
    select: "name email"
  })
});

diagnosisSchema.pre("save", function(next) {
  // check if user is a 
})

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);

module.exports = Diagnosis;
