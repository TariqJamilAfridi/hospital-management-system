const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

/* Mark Appointment as Paid (legacy endpoint) */
router.put("/:id/pay", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: "Paid",
      },
      {
        new: true,
      }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.json({
      success: true,
      message: "Payment successful",
      appointment,
    });
  } catch (error) {
    console.error("Payment update error:", error);
    res.status(500).json({
      success: false,
      message: "Payment update failed",
      error: error.message,
    });
  }
});

/* Update Payment Status (new endpoint) */
router.put("/:id/status", async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    // Validate payment status
    const validStatuses = ["Pending", "Paid", "Failed", "Refunded"];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    console.log(`💳 Updating payment status for appointment ${req.params.id} to: ${paymentStatus}`);

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus,
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!appointment) {
      console.log(`❌ Appointment not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    console.log(`✅ Payment status updated successfully for: ${req.params.id}`);

    res.json({
      success: true,
      message: "Payment status updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("❌ Payment status update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
});

module.exports = router;