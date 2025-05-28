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
        message: "{VALUE} is not a valid appointment type",
      },
    },
    timeSlot: {
      type: String,
      // required: [true, "Time slot for appointment is required."],
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
    time: {
      type: Date,
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


// ================ Deepseek rewrote the logic and it's working, don't touch =================== //
// Logic is to prevent appointment conflicts
appointmentSchema.pre("save", async function (next) {
  const APPOINTMENT_DURATION = 30 * 60 * 1000; 
  try {
    const Appointment = mongoose.models.Appointment;
    const physicianId = this.physician.toString();

    // Check physician exists
    const physician = await Physician.findOne({ user: physicianId });
    if (!physician) {
      return next(
        new AppError("The selected healthcare provider is not available", 401)
      );
    }

    // Parse time slot if provided as string
    if (this.timeSlot && typeof this.timeSlot === "string") {
      const timeRegex = /^(\d{1,2}):(\d{2})\s(AM|PM)$/i;
      if (!timeRegex.test(this.timeSlot)) {
        return next(
          new AppError(
            "Invalid time slot format. Please use format like '9:30 AM'",
            400
          )
        );
      }

      const [time, period] = this.timeSlot.split(" ");
      const [hours, minutes] = time.split(":").map(Number);

      const date = new Date(this.date);
      let adjustedHours = hours;

      if (period.toUpperCase() === "PM" && hours < 12) {
        adjustedHours += 12;
      } else if (period.toUpperCase() === "AM" && hours === 12) {
        adjustedHours = 0;
      }

      date.setHours(adjustedHours, minutes, 0, 0);
      this.time = date;
    }

    // Validate we have a valid time
    if (!(this.time instanceof Date) || isNaN(this.time.getTime())) {
      return next(new AppError("Invalid appointment time", 400));
    }

    const appointmentStart = this.time;
    const appointmentEnd = new Date(
      appointmentStart.getTime() + APPOINTMENT_DURATION
    );

    // Check for physician availability
    const isPhysicianConflict = await Appointment.exists({
      physician: this.physician,
      $and: [
        { time: { $lt: appointmentEnd } },
        { time: { $gte: appointmentStart } },
      ],
    });

    if (isPhysicianConflict) {
      return next(
        new AppError(
          "The healthcare provider is not available at this time",
          400
        )
      );
    }

    // Check for patient conflicts
    const isPatientConflict = await Appointment.exists({
      patient: this.patient,
      $and: [
        { time: { $lt: appointmentEnd } },
        { time: { $gte: appointmentStart } },
      ],
    });

    if (isPatientConflict) {
      return next(
        new AppError(
          "You already have an appointment scheduled during this time",
          400
        )
      );
    }

    // Prevent past scheduling
    if (this.time <= new Date()) {
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
