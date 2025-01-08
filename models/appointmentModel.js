const mongoose = require("mongoose");
const Physician = require("./physicianModel");
const AppError = require("./../utils/appError");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient must be specified for the appointment"],
    },
    physician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Physician must be specified for the appointment"],
    },
    timeSlot: {
      type: Date,
      required: [true, "Time slot for appointment is required."],
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: "Appointment time slot must be in the future.",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["scheduled", "completed", "cancelled", "no-show"],
        message: "{VALUE} is not supported",
      },
      default: "scheduled",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator of the appointment must be specified"],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Index for optimized querying
appointmentSchema.index({ physician: 1, timeSlot: 1 });

appointmentSchema.virtual("diagnosis", {
  ref: "Diagnosis",
  foreignField: "appointment",
  localField: "_id",
});
appointmentSchema.virtual("tests", {
  ref: "Test",
  foreignField: "appointment",
  localField: "_id",
});

appointmentSchema.pre(/^find/, function (next) {
  this.populate({ path: "diagnosis", select: "symptoms note" }); // Automatically populate the virtual
  next();
});
appointmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "tests",
    select: "name category interpretation -appointment",
  }); // Automatically populate the virtual
  next();
});

appointmentSchema.pre("save", async function (next) {
  try {
    // Check if physician exists
    const objectId = this.physician;
    const string = objectId.toString();

    const physician = await Physician.findOne({ user: string });
    if (!physician) {
      return next(new AppError("User is not a physician", 401));
    }

    // Check for conflicting appointments with the same physician
    const Appointment = mongoose.models.Appointment;
    const isPhysicianConflict = await Appointment.exists({
      physician: this.physician,
      timeSlot: this.timeSlot,
    });
    if (isPhysicianConflict) {
      return next(
        new AppError(
          `Physician is not available for the appointment at ${this.timeSlot}`,
          400
        )
      );
    }

    // Check for conflicting appointments with the same patient
    const isPatientConflict = await Appointment.exists({
      patient: this.patient,
      timeSlot: this.timeSlot,
    });
    if (isPatientConflict) {
      return next(
        new AppError(
          "You already have an appointment booked for this time slot.",
          400
        )
      );
    }

    // Prevent appointments in the past
    if (this.timeSlot <= Date.now()) {
      return next(
        new AppError("Cannot schedule appointments in the past", 400)
      );
    }

    next();
  } catch (err) {
    next(err);
  }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
