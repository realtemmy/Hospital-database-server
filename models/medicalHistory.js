const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Physician",
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    treatment: {
        type: String,
        required: true,
    },
    prescription: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: false,
        trim: true,
    },
    },
    {
    timestamps: true,
});