const express = require("express");
const Appointment = require("../models/Appointment");
const { asyncHandler, AppError } = require("../middleware/errorHandler");
const { 
  validateAppointmentData, 
  validateAppointmentStatus 
} = require("../middleware/validators");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/* Create Appointment - Requires authentication */
router.post("/", protect, validateAppointmentData, asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    date,
    time,
    doctor,
    doctorId,
    specialty,
    fee,
  } = req.body;

  // Check for existing appointment at the same time
  const existingAppointment = await Appointment.findOne({
    doctor: doctor || "Dr. Nasreen Kasor",
    date,
    time,
    appointmentStatus: {
      $nin: ["Cancelled", "No-Show"],
    },
  });

  if (existingAppointment) {
    throw new AppError(
      "This appointment time is already booked. Please select another time.",
      400
    );
  }

  // Create appointment
  const appointment = new Appointment({
    userId: req.user._id, // Link to authenticated user
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    doctor: doctor || "Dr. Nasreen Kasor",
    doctorId,
    specialty: specialty || "Gynecology Specialist",
    date,
    time,
    fee: fee || 2000,
  });

  const savedAppointment = await appointment.save();

  console.log(`✅ Appointment created by user: ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully",
    appointment: savedAppointment,
  });
}));

/* Get All Appointments - Admin only */
router.get("/", protect, authorize("admin"), asyncHandler(async (req, res) => {
  const { date, status, userId } = req.query;

  const filter = {};

  if (date) {
    filter.date = date;
  }

  if (status) {
    filter.appointmentStatus = status;
  }

  if (userId) {
    filter.userId = userId;
  }

  const appointments = await Appointment.find(filter)
    .populate("userId", "fullName email phone")
    .sort({ createdAt: -1 })
    .select('-__v');

  res.json({
    success: true,
    count: appointments.length,
    appointments,
  });
}));

/* Get My Appointments - User's own appointments */
router.get("/my-appointments", protect, asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .select('-__v');

  res.json({
    success: true,
    count: appointments.length,
    appointments,
  });
}));

/* Get booked slots for a specific date and doctor */
router.get("/booked-slots", asyncHandler(async (req, res) => {
  const { date, doctor } = req.query;

  if (!date || !doctor) {
    throw new AppError("Please provide date and doctor", 400);
  }

  const bookedAppointments = await Appointment.find({
    date,
    doctor,
    appointmentStatus: {
      $nin: ["Cancelled", "No-Show"],
    },
  }).select("time");

  const bookedSlots = bookedAppointments.map((apt) => apt.time);

  res.json({
    success: true,
    bookedSlots,
  });
}));

/* Update Appointment Status - Admin only */
router.put("/:id/status", protect, authorize("admin"), validateAppointmentStatus, asyncHandler(async (req, res) => {
  const { appointmentStatus } = req.body;

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { appointmentStatus },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  console.log(`✅ Appointment status updated by admin: ${req.user.email}`);

  res.json({
    success: true,
    message: "Appointment status updated successfully",
    appointment,
  });
}));

/* Delete Appointment - Admin only */
router.delete("/:id", protect, authorize("admin"), asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  console.log(`✅ Appointment deleted by admin: ${req.user.email}`);

  res.json({
    success: true,
    message: "Appointment deleted successfully",
  });
}));

module.exports = router;