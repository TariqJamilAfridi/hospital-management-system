const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

/* Mark Appointment as Paid */
router.put("/:id/pay", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: "Paid",
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
      message: "Payment successful",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Payment update failed",
      error: error.message,
    });
  }
});

module.exports = router;