const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },
    specialty: {
      type: String,
      required: [true, "Specialty is required"],
      trim: true,
    },
    qualifications: {
      type: String,
      required: [true, "Qualifications are required"],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{11}$/, "Please provide a valid 11-digit phone number"],
    },
    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
      min: [0, "Fee cannot be negative"],
      default: 2000,
    },
    profileImage: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    totalPatients: {
      type: Number,
      default: 0,
      min: [0, "Total patients cannot be negative"],
    },
    availability: {
      type: [String],
      required: true,
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    availableTimeSlots: {
      type: [String],
      required: true,
      default: [
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
      ],
    },
    about: {
      type: String,
      trim: true,
      maxlength: [1000, "About section cannot exceed 1000 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
doctorSchema.index({ specialty: 1, isActive: 1 });
doctorSchema.index({ name: 1 });

// Virtual field to map consultationFee to fee for frontend compatibility
doctorSchema.virtual('fee').get(function() {
  return this.consultationFee;
});

// Virtual fields for frontend compatibility
doctorSchema.virtual('image').get(function() {
  return this.profileImage;
});

doctorSchema.virtual('availableDays').get(function() {
  if (this.availability && this.availability.length > 0) {
    return this.availability.join(', ');
  }
  return 'Not specified';
});

doctorSchema.virtual('availableTime').get(function() {
  if (this.availableTimeSlots && this.availableTimeSlots.length > 0) {
    const first = this.availableTimeSlots[0];
    const last = this.availableTimeSlots[this.availableTimeSlots.length - 1];
    return `${first} - ${last}`;
  }
  return 'Not specified';
});

// Ensure virtuals are included when converting to JSON
doctorSchema.set('toJSON', { virtuals: true });
doctorSchema.set('toObject', { virtuals: true });

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
