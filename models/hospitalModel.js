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
    departments: [
      {
        type: String,
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
          required: true,
          trim: true,
          validate: {
            validator: function (value) {
              return !this.rooms.some((room) => room.roomNumber === value);
            },
            message: "Room number must be unique within the hospital",
          },
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
          default: 1,
          min: 1,
        },
        isOccupied: {
          type: Boolean,
          default: false,
        },
        currentPatients: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
          },
        ],
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
  // room is occupied if the current patients are equalto the capacity
  this.rooms.forEach((room) => {
    room.isOccupied = room.currentPatients.length >= room.capacity;
  });
  next();
});

hospitalSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const query = this.getQuery();

  // Check if a patient is being added to or removed from a room
  if (
    (update.$push && update.$push["rooms.$.currentPatients"]) ||
    (update.$pull && update.$pull["rooms.$.currentPatients"])
  ) {
    // Find the hospital document
    const hospital = await this.model.findOne(query);

    if (hospital) {
      // Find the specific room being updated
      const room = hospital.rooms.find((r) =>
        query["rooms.roomNumber"]
          ? r.roomNumber === query["rooms.roomNumber"]
          : false
      );

      if (room) {
        // Count the current number of patients in the room
        let patientCount = room.currentPatients.length;

        // Adjust count based on update operation
        if (update.$push) {
          patientCount += 1; // A new patient is added
        } else if (update.$pull) {
          patientCount -= 1; // A patient is removed
        }

        // Check if the room should be marked as occupied or not
        const isOccupied = patientCount >= room.capacity;

        // Update the isOccupied field
        this.updateOne({}, { $set: { "rooms.$.isOccupied": isOccupied } });
      }
    }
  }

  next();
});


const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
