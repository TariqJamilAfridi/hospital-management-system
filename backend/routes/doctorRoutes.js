const express = require("express");
const Doctor = require("../models/Doctor");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/doctors
// @desc    Get all active doctors
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { specialty, search } = req.query;

    // Build query
    // Keep backward compatibility for older doctor records that do not yet have
    // the isActive field populated.
    let query = {
      $or: [
        { isActive: true },
        { isActive: { $exists: false } },
      ],
    };

    if (specialty) {
      query.specialty = specialty;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialty: { $regex: search, $options: "i" } },
      ];
    }

    const doctors = await Doctor.find(query)
      .select("-addedBy")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("❌ Get doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      error: error.message,
    });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get single doctor by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-addedBy");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error("❌ Get doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor",
      error: error.message,
    });
  }
});

// @route   POST /api/doctors
// @desc    Add a new doctor (Admin only)
// @access  Private/Admin
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      name,
      specialty,
      qualifications,
      experience,
      email,
      phone,
      gender,
      consultationFee,
      profileImage,
      availability,
      availableTimeSlots,
      about,
    } = req.body;

    // Check if doctor with email already exists
    const existingDoctor = await Doctor.findOne({ email: email.toLowerCase() });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    // Create doctor
    const normalizedAvailability = Array.isArray(availability)
      ? availability
      : (typeof availability === "string" && availability.trim())
        ? availability.split(",").map((day) => day.trim()).filter(Boolean)
        : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const doctor = await Doctor.create({
      name,
      specialty,
      qualifications,
      experience,
      email: email.toLowerCase(),
      phone,
      gender: gender || "Other",
      consultationFee: consultationFee || 2000,
      profileImage,
      availability: normalizedAvailability,
      availableTimeSlots: availableTimeSlots || [
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
      ],
      about,
      addedBy: req.user._id,
    });

    console.log(`✅ New doctor added by ${req.user.email}: ${doctor.name}`);

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor,
    });
  } catch (error) {
    console.error("❌ Add doctor error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || "Validation failed",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add doctor",
      error: error.message,
    });
  }
});

// @route   PUT /api/doctors/:id
// @desc    Update doctor (Admin only)
// @access  Private/Admin
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      name,
      specialty,
      qualifications,
      experience,
      email,
      phone,
      gender,
      consultationFee,
      profileImage,
      availability,
      availableTimeSlots,
      about,
      isActive,
    } = req.body;

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if email is being changed and already exists
    if (email && email.toLowerCase() !== doctor.email) {
      const existingDoctor = await Doctor.findOne({ email: email.toLowerCase() });
      if (existingDoctor) {
        return res.status(400).json({
          success: false,
          message: "Another doctor with this email already exists",
        });
      }
    }

    // Update fields
    if (name) doctor.name = name;
    if (specialty) doctor.specialty = specialty;
    if (qualifications) doctor.qualifications = qualifications;
    if (experience !== undefined) doctor.experience = experience;
    if (email) doctor.email = email.toLowerCase();
    if (phone) doctor.phone = phone;
    if (gender) doctor.gender = gender;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (profileImage !== undefined) doctor.profileImage = profileImage;
    if (availability) {
      doctor.availability = Array.isArray(availability)
        ? availability
        : availability.split(",").map((day) => day.trim()).filter(Boolean);
    }
    if (availableTimeSlots) doctor.availableTimeSlots = availableTimeSlots;
    if (about !== undefined) doctor.about = about;
    if (isActive !== undefined) doctor.isActive = isActive;

    await doctor.save();

    console.log(`✅ Doctor updated by ${req.user.email}: ${doctor.name}`);

    res.json({
      success: true,
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    console.error("❌ Update doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update doctor",
      error: error.message,
    });
  }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor (Admin only)
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Soft delete - just mark as inactive
    doctor.isActive = false;
    await doctor.save();

    console.log(`✅ Doctor deactivated by ${req.user.email}: ${doctor.name}`);

    res.json({
      success: true,
      message: "Doctor deactivated successfully",
    });
  } catch (error) {
    console.error("❌ Delete doctor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete doctor",
      error: error.message,
    });
  }
});

// @route   GET /api/doctors/specialties/list
// @desc    Get list of all unique specialties
// @access  Public
router.get("/specialties/list", async (req, res) => {
  try {
    const specialties = await Doctor.distinct("specialty", { isActive: true });

    res.json({
      success: true,
      specialties: specialties.sort(),
    });
  } catch (error) {
    console.error("❌ Get specialties error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch specialties",
      error: error.message,
    });
  }
});

module.exports = router;
