const express = require("express");
const { Safepay } = require("@sfpy/node-sdk");
const Appointment = require("../models/Appointment");

const router = express.Router();

console.log(
  "API key loaded:",
  Boolean(process.env.SAFE_PAY_API_KEY)
);

console.log(
  "Secret key loaded:",
  Boolean(process.env.SAFE_PAY_SECRET_KEY)
);

console.log(
  "Webhook secret loaded:",
  Boolean(process.env.SAFE_PAY_WEBHOOK_SECRET)
);

console.log(
  "Webhook secret length:",
  process.env.SAFE_PAY_WEBHOOK_SECRET?.length
);

const safepay = new Safepay({
  environment: "sandbox",
  apiKey: process.env.SAFE_PAY_API_KEY,
  v1Secret: process.env.SAFE_PAY_SECRET_KEY,
  webhookSecret: process.env.SAFE_PAY_WEBHOOK_SECRET,
});


// =====================================================
// CREATE SAFEPAy CHECKOUT
// =====================================================

router.post("/create-session", async (req, res) => {
  try {
    const {
      appointmentId,
      amount,
    } = req.body;

    if (!appointmentId || !amount) {
      return res.status(400).json({
        message: "Appointment ID and amount are required.",
      });
    }

    // Find appointment
    const appointment = await Appointment.findById(
      appointmentId
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    // Make sure payment has not already been completed
    if (appointment.paymentStatus === "Paid") {
      return res.status(400).json({
        message: "This appointment has already been paid.",
      });
    }

    // Create Safepay payment
    const payment = await safepay.payments.create({
      amount: Number(amount) * 100,
      currency: "PKR",
    });

    const token = payment.token;

    // Create Safepay hosted checkout
    const checkoutUrl = safepay.checkout.create({
      token,
      orderId: appointmentId,
      cancelUrl:
        "http://localhost:3000/payment",
      redirectUrl:
        "http://localhost:3000/appointment-success",
      source: "custom",
      webhooks: true,
    });

    console.log(
      "Safepay checkout created successfully"
    );

    res.json({
      message:
        "Safepay checkout created successfully",
      checkoutUrl,
      token,
    });

  } catch (error) {
    console.error(
      "Safepay checkout error:"
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Response:",
      error.response?.data
    );

    res.status(500).json({
      message:
        "Failed to create Safepay checkout.",
      error: error.message,
      safepayError:
        error.response?.data || null,
    });
  }
});


// =====================================================
// SAFEPAy WEBHOOK
// =====================================================

router.post("/webhook", async (req, res) => {
  try {
    console.log(
      "Safepay webhook received."
    );

    // Verify webhook signature
    const event =
      await safepay.verify.webhook(req);

    console.log(
      "Safepay webhook verified successfully."
    );

    console.log(
      "Webhook event:",
      event
    );

    // Get event type
    const eventType =
      event?.type;

    console.log(
      "Event type:",
      eventType
    );

    // -------------------------------------------------
    // PAYMENT SUCCESS
    // -------------------------------------------------

    if (eventType === "payment.succeeded") {

      const paymentData =
        event?.data;

      console.log(
        "Payment succeeded:",
        paymentData
      );

      // Try to get appointment/order ID
      const appointmentId =
        paymentData?.order_id ||
        paymentData?.orderId ||
        event?.order_id ||
        event?.orderId;

      if (!appointmentId) {
        console.error(
          "Appointment ID was not found in Safepay webhook."
        );

        return res.status(400).json({
          message:
            "Appointment ID not found.",
        });
      }

      console.log(
        "Appointment ID:",
        appointmentId
      );

      // Find appointment
      const appointment =
        await Appointment.findById(
          appointmentId
        );

      if (!appointment) {
        console.error(
          "Appointment not found:",
          appointmentId
        );

        return res.status(404).json({
          message:
            "Appointment not found.",
        });
      }

      // Update payment status
      appointment.paymentStatus =
        "Paid";

      await appointment.save();

      console.log(
        "Appointment payment status updated to Paid."
      );

      return res.status(200).json({
        message:
          "Payment successfully processed.",
      });
    }


    // -------------------------------------------------
    // PAYMENT FAILED
    // -------------------------------------------------

    if (eventType === "payment.failed") {

      console.log(
        "Safepay payment failed."
      );

      return res.status(200).json({
        message:
          "Payment failure received.",
      });
    }


    // -------------------------------------------------
    // OTHER EVENTS
    // -------------------------------------------------

    console.log(
      "Unhandled Safepay event:",
      eventType
    );

    return res.status(200).json({
      message:
        "Webhook received.",
    });

  } catch (error) {

    console.error(
      "Safepay webhook error:"
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Response:",
      error.response?.data
    );

    return res.status(400).json({
      message:
        "Webhook verification failed.",
    });
  }
});


module.exports = router;