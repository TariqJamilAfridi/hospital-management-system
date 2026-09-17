const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

/* Create Appointment */
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      date,
      time,
    } = req.body;
    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Please provide a valid appointment date.",
      });
    }

    if (selectedDate.getDay() !== 1) {
      return res.status(400).json({
        message:
          "Dr. Nasreen Kasor is available only on Mondays.",
      });
    }
    const allowedTimes = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "01:00 PM",
    ];

    if (!allowedTimes.includes(time)) {
      return res.status(400).json({
        message: "Please select a valid appointment time.",
      });
    }
    const existingAppointment = await Appointment.findOne({
      doctor: "Dr. Nasreen Kasor",
      date,
      time,
      appointmentStatus: {
        $ne: "Cancelled",
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message:
          "This appointment time is already booked. Please select another time.",
      });
    }

    const appointment = new Appointment({
      fullName,
      email,
      phone,
      date,
      time,
    });

    const savedAppointment = await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: savedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to book appointment",
      error: error.message,
    });
  }
});

/* Get All Appointments */
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;

    const filter = {};

    if (date) {
      filter.date = date;
    }

    const appointments = await Appointment.find(filter).sort({
      createdAt: -1,
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
});

/* Update Appointment Status */
router.put("/:id/status", async (req, res) => {
  try {
    const { appointmentStatus } = req.body;

    const allowedStatuses = [
      "Booked",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(appointmentStatus)) {
      return res.status(400).json({
        message: "Invalid appointment status",
      });
    }

    const appointment =
      await Appointment.findByIdAndUpdate(
        req.params.id,
        {
          appointmentStatus,
        },
        {
          returnDocument: "after",
        }
      );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update appointment status",
      error: error.message,
    });
  }
});

module.exports = router;