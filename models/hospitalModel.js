const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Hospital address is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Hospital phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Hospital email is required"],
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      trim: true,
    },
    // Array of laboratories associated with the hospital
    // laboratories: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Laboratory",
    //   },
    // ],
    rooms: [
      {
        roomNumber: {
          type: String,
          required: [true, "Room number is required"],
          trim: true,
        },
        roomType: {
          type: String,
          required: [true, "Room type is required"],
          enum: [
            "General Ward",
            "ICU",
            "Operation Theater",
            "Private Room",
            "Emergency Room",
          ],
        },
        capacity: {
          type: Number,
          required: [true, "Room capacity is required"],
        },
        isOccupied: {
          type: Boolean,
          default: false,
        },
        currentPatient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Patient",
        },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

hospitalSchema.index({ _id: 1, "rooms.roomNumber": 1 }, { unique: true });

// Virtual to get the total number of rooms in the hospital
hospitalSchema.virtual("totalRooms").get(function () {
  return this.rooms.length;
});

// Virtual to get the number of occupied rooms
hospitalSchema.virtual("occupiedRooms").get(function () {
  return this.rooms.filter((room) => room.isOccupied).length;
});

// Virtual to get the number of available rooms
hospitalSchema.virtual("availableRooms").get(function () {
  return this.rooms.filter((room) => !room.isOccupied).length;
});

hospitalSchema.pre("save", function (next) {
  this.rooms.forEach((room) => {
    room.isOccupied = !!room.currentPatient;
  });
  next();
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
