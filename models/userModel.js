const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Patient must have a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Patient must have a last name"],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: [true, "User should have an email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    password: {
      type: String,
      required: [true, "A user must have a password."],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      // Remember to validate
      type: String,
      required: [true, "please input confirm password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same.",
      },
    },
    role: {
      type: String,
      enum: {
        values: ["Patient", "Physician", "Admin"],
        message: "{VALUE} is not supported as a user role",
      },
      default: "Patient",
    },
    photo: String,
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message:
          "{value} for gender is not supported. Only male and female are supported values for Gender",
      },
      required: [true, "User must provide gender"],
    },
    dateOfBirth: {
      type: Date,
    },
    socials: [
      {
        title: String,
        value: String,
      },
    ],
    //   Maybe add up to 2 or 3 emergency contacts
    emergencyContact: [
      {
        name: {
          type: String,
        },
        relationship: {
          type: String,
        },
        phone: {
          type: String,
        },
        email: {
          type: String,
        },
      },
    ],
    expire: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return 0;

  const birthdate = this.dateOfBirth;
  const age = Math.floor(
    (Date.now() - birthdate.getTime()) / (1000 * 3600 * 24 * 365)
  );
  return age;
});
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (this.dateOfBirth > Date.now()) {
    return next(new AppError("Date of birth cannot be in the future", 401));
  }
  next();
});

userSchema.methods.comparePasswords = async function (
  userPassword,
  JWTEncodedPassword
) {
  return await bcrypt.compare(userPassword, JWTEncodedPassword);
};

userSchema.pre("save", function (next) {
  if (this.role === "Admin") {
  }
});

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // generate 32 byte token
  const resetToken = crypto.randomBytes(32).toString("hex");
  // Hashed token to be stored in DB
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // password should expire in 10 mins
  this.passwordExpiresAt = Date.now() + 10 * 1000 * 60;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
