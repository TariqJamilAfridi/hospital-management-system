const express = require("express");
const { Safepay } = require("@sfpy/node-sdk");
const Appointment = require("../models/Appointment");

const router = express.Router();
const frontendUrl = (
  process.env.FRONTEND_URL || "http://localhost:3000"
).replace(/\/$/, "");
const safepayApiKey =
  process.env.SAFE_PAY_API_KEY || process.env.SAFEPAY_API_KEY;
const safepaySecretKey =
  process.env.SAFE_PAY_SECRET_KEY || process.env.SAFEPAY_SECRET_KEY;
const safepayWebhookSecret =
  process.env.SAFE_PAY_WEBHOOK_SECRET || process.env.SAFEPAY_WEBHOOK_SECRET;

console.log(
  "API key loaded:",
  Boolean(safepayApiKey)
);

console.log(
  "Secret key loaded:",
  Boolean(safepaySecretKey)
);

console.log(
  "Webhook secret loaded:",
  Boolean(safepayWebhookSecret)
);

console.log(
  "Webhook secret length:",
  safepayWebhookSecret?.length
);

const safepay = new Safepay({
  environment: "sandbox",
  apiKey: safepayApiKey,
  v1Secret: safepaySecretKey,
  webhookSecret: safepayWebhookSecret,
});


/* =====================================================
   CREATE SAFEPAY CHECKOUT
===================================================== */

router.post(
  "/create-session",
  express.json(),
  async (req, res) => {
    try {
      const {
        appointmentId,
        amount,
      } = req.body;

      console.log(
        "Create Safepay session request:",
        {
          appointmentId,
          amount,
        }
      );

      if (!appointmentId || !amount) {
        return res.status(400).json({
          message:
            "Appointment ID and amount are required.",
        });
      }

      const appointment =
        await Appointment.findById(
          appointmentId
        );

      if (!appointment) {
        return res.status(404).json({
          message:
            "Appointment not found.",
        });
      }

      if (
        appointment.paymentStatus ===
        "Paid"
      ) {
        return res.status(400).json({
          message:
            "This appointment has already been paid.",
        });
      }

      const payment =
        await safepay.payments.create({
          amount:
            Number(amount) * 100,
          currency: "PKR",
        });

      const token = payment.token;

      const checkoutUrl =
        safepay.checkout.create({
          token,
          orderId:
            appointmentId,
          cancelUrl:
            `${frontendUrl}/payment`,
          redirectUrl:
            `${frontendUrl}/appointment-success`,
          source: "custom",
          webhooks: true,
        });

      console.log(
        "Safepay checkout created successfully"
      );

      console.log(
        "Appointment ID:",
        appointmentId
      );

      console.log(
        "Checkout URL:",
        checkoutUrl
      );

      return res.json({
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

      return res.status(500).json({
        message:
          "Failed to create Safepay checkout.",
        error:
          error.message,
        safepayError:
          error.response?.data ||
          null,
      });
    }
  }
);


/* =====================================================
   SAFEPAY WEBHOOK
===================================================== */

/* =====================================================
   SAFEPAY WEBHOOK
===================================================== */

router.post(
  "/webhook",
  express.raw({
    type: "application/json",
  }),
  async (req, res) => {
    try {
      console.log("====================================");
      console.log("Safepay webhook received.");

      const signature =
        req.headers["x-sfpy-signature"];

      console.log(
        "Safepay signature received:",
        Boolean(signature)
      );

      console.log(
        "Content-Type:",
        req.headers["content-type"]
      );

      console.log(
        "Raw body:",
        Buffer.isBuffer(req.body)
      );

      if (!signature) {
        console.error(
          "Safepay webhook signature is missing."
        );

        return res.status(400).json({
          message:
            "Safepay webhook signature is missing.",
        });
      }

      /*
        Verify the webhook using the official
        Safepay Node SDK.
      */

      const event =
        await safepay.verify.webhook(req);

      console.log(
        "Safepay webhook verified successfully."
      );

      console.log(
        "Webhook event:",
        JSON.stringify(event, null, 2)
      );

      const eventType =
        event?.type;

      console.log(
        "Event type:",
        eventType
      );

      /*
        Safepay webhook events may contain
        the payment information inside data.
      */

      if (
        eventType === "payment.succeeded" ||
        eventType === "payment:created"
      ) {
        const paymentData =
          event?.data || {};

        console.log(
          "Payment data:",
          JSON.stringify(
            paymentData,
            null,
            2
          )
        );

        /*
          Try to find our appointment ID.

          Depending on the Safepay webhook
          payload, it may be available as
          order_id/orderId/reference or
          inside metadata.
        */

        const appointmentId =
          paymentData?.order_id ||
          paymentData?.orderId ||
          paymentData?.metadata?.order_id ||
          paymentData?.metadata?.orderId ||
          paymentData?.notification?.metadata?.order_id ||
          event?.order_id ||
          event?.orderId;

        console.log(
          "Appointment ID:",
          appointmentId
        );

        if (!appointmentId) {
          console.error(
            "Appointment ID was not found in webhook."
          );

          return res.status(400).json({
            message:
              "Appointment ID not found in Safepay webhook.",
          });
        }

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

        appointment.paymentStatus =
          "Paid";

        await appointment.save();

        console.log(
          "===================================="
        );

        console.log(
          "PAYMENT STATUS UPDATED TO PAID"
        );

        console.log(
          "Appointment ID:",
          appointment._id
        );

        console.log(
          "Payment Status:",
          appointment.paymentStatus
        );

        console.log(
          "===================================="
        );

        return res.status(200).json({
          message:
            "Payment successfully processed.",
        });
      }

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
        "===================================="
      );

      console.error(
        "Safepay webhook verification error:"
      );

      console.error(
        "Message:",
        error.message
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "===================================="
      );

      return res.status(400).json({
        message:
          "Webhook verification failed.",
      });
    }
  }
);


module.exports = router;