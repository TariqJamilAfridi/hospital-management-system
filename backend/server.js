require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import routes
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const safepayRoutes = require("./routes/safepayRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

// Import middleware
const { logger } = require("./middleware/logger");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const { sanitizeInput } = require("./middleware/validators");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Request logging
app.use(logger);

/*
  IMPORTANT:
  Safepay webhook needs the original request body for
  webhook signature verification.

  Therefore, we do NOT use express.json() globally before
  the Safepay webhook route.
*/

// Safepay routes are registered first
app.use("/api/safepay", safepayRoutes);

// Normal JSON API routes with middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize user input
app.use(sanitizeInput);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CarePlus Hospital Backend is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// API status endpoint
app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/doctors", doctorRoutes);

// 404 handler - must be after all routes
app.use(notFound);

// Error handler - must be last
app.use(errorHandler);

// MongoDB connection with better error handling
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log(`📦 Database: ${mongoose.connection.name}`);
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("💡 Tip: Make sure MongoDB is running and MONGO_URI is correct in .env");
    process.exit(1); // Exit if database connection fails
  });

// Handle MongoDB connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB reconnected");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("\n👋 MongoDB connection closed. Server shutting down gracefully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;