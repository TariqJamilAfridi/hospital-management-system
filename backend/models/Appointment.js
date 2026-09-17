const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    doctor: {
      type: String,
      required: true,
      default: "Dr. Nasreen Kasor",
    },

    specialty: {
      type: String,
      required: true,
      default: "Gynecology Specialist",
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    fee: {
      type: Number,
      required: true,
      default: 2000,
    },

    paymentStatus: {
      type: String,
      default: "Pending",
    },

    appointmentStatus: {
      type: String,
      default: "Booked",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

module.exports = Appointment;