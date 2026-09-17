require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const appointmentRoutes = require("./routes/appointmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const safepayRoutes = require("./routes/safepayRoutes");


const app = express();

const PORT = process.env.PORT || 5000;

/* Middleware */
app.use(cors());
app.use(express.json());

/* Connect MongoDB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

/* Test Route */
app.get("/", (req, res) => {
  res.json({
    message: "CarePlus Hospital Backend is running",
  });
});

/* Appointment Routes */
app.use("/api/appointments", appointmentRoutes);
/* Payment Routes */
app.use("/api/payments", paymentRoutes);
app.use("/api/safepay", safepayRoutes);

/* Start Server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});