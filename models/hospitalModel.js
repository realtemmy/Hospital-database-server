const mongoose = require("mongoose");
const validator = require("validator");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
    },
    type: {
      type: String,
      requird: [true, "Hospital type is required"],
      enum: [
        "general",
        "specialized",
        "teaching",
        "research",
        "community",
        "private",
        "public",
        "other",
      ],
    },
    specializations: [
      {
        type: String,
      },
    ],
    phone: {
      type: String,
      validate: {
        validator: function (value) {
          return /^\d{11}$/.test(value); // Example: Validate a 10-digit phone number
        },
        message: `{VALUE} is not a valid phone number. It should be 11 digits long.`,
      },
      required: [true, "Hospital phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Hospital email is required"],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    website: {
      type: String,
      trim: true,
      validate: [validator.isURL, "Please enter a valid URL"],
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
        minLength: 5,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
        minLength: 2,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        minLength: 2,
      },
      zip: {
        type: String,
        required: [true, "Zip code is required"],
        trim: true,
        minLength: 6,
        validate: {
          validator: function (value) {
            return /^\d{6}$/.test(value);
          },
          message: "Invalid Postal code. Must be at least 6 digits",
        },
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
        minLength: 2,
      },
    },
    emergencyServices: {
      type: Boolean,
      default: false,
    },
    licenseNumber: {
      type: String,
      required: [true, "Hospital license number is required"],
      minLength: 5,
    },
    taxId: {
      type: String,
      minLength: 2,
      required: [true, "Hospital taxId is required."],
    },
    accreditations: [{ type: String }],
    description: { type: String },
    yearEstablished: {
      type: Number,
      required: [true, "Hospital creation date is required."],
      min: [1800, "Creation date should not be less than 1800."],
      max: [
        new Date().getFullYear(),
        "Hospital cannot be created in the future.",
      ],
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
          min: [1, "Room cannot occupy less than one person"],
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
