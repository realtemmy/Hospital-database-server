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
      // required: [true, "Physician must be specified for the appointment"],
    },
    type: {
      type: String,
      required: [true, "Type of appointment is required."],
      enum: {
        values: [
          "general",
          "follow-up",
          "emergency",
          "consultation",
          "surgery",
        ],
        message: "{VALUE} is not a valid appoin tment type",
      },
    },
    timeSlot: {
      type: Date,
      // required: [true, "Time slot for appointment is required."],
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: "Appointment time slot must be in the future.",
      },
    },
    date: {
      type: Date,
      required: [true, "Date of the appointment is required."],
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: "Appointment date must be today or in the future.",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["scheduled", "confirmed", "completed", "cancelled", "no-show"],
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
  options: function () {
    return {
      match: { patient: this.patient },
    };
  },
});
appointmentSchema.virtual("tests", {
  ref: "Test",
  foreignField: "appointment",
  localField: "_id",
  options: function () {
    return {
      match: { patient: this.patient },
    };
  },
});

appointmentSchema.pre("save", async function (next) {
  try {
    const Appointment = mongoose.models.Appointment;

    const physicianId = this.physician.toString();

    // Check if the physician exists
    const physician = await Physician.findOne({ user: physicianId });
    if (!physician) {
      return next(new AppError("User is not a physician", 401));
    }

    // Define appointment duration (e.g., 30 minutes)
    const APPOINTMENT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Calculate the start and end time of the new appointment
    const appointmentStart = this.timeSlot;
    const appointmentEnd = new Date(
      appointmentStart.getTime() + APPOINTMENT_DURATION
    );

    // Check for overlapping appointments for the same physician
    const isPhysicianConflict = await Appointment.exists({
      physician: this.physician,
      $or: [
        { timeSlot: { $gte: appointmentStart, $lt: appointmentEnd } }, // Starts within the new appointment window
        {
          timeSlot: {
            $lt: appointmentStart,
            $gte: new Date(appointmentStart - APPOINTMENT_DURATION),
          },
        }, // Ends within the new appointment window
      ],
    });

    if (isPhysicianConflict) {
      return next(
        new AppError(
          `Physician is not available between ${appointmentStart.toISOString()} and ${appointmentEnd.toISOString()}`,
          400
        )
      );
    }

    // Check for overlapping appointments for the same patient
    const isPatientConflict = await Appointment.exists({
      patient: this.patient,
      $or: [
        { timeSlot: { $gte: appointmentStart, $lt: appointmentEnd } },
        {
          timeSlot: {
            $lt: appointmentStart,
            $gte: new Date(appointmentStart - APPOINTMENT_DURATION),
          },
        },
      ],
    });

    if (isPatientConflict) {
      return next(
        new AppError(
          "You already have an appointment booked within this time frame.",
          400
        )
      );
    }

    // Prevent scheduling in the past
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

// if after timeslot date is passed, appointment is no-show

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
