import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
    },
    type: {
      type: String,
      enum: ["email", "phone"],
      required: [true, "OTP type is required"],
    },
    purpose: {
      type: String,
      enum: ["verification", "password_reset", "login"],
      default: "verification",
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index - MongoDB will automatically delete expired documents
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
otpSchema.index({ userId: 1, type: 1, purpose: 1 });
otpSchema.index({ email: 1, type: 1 });
otpSchema.index({ phoneNumber: 1, type: 1 });

// Method to verify OTP
otpSchema.methods.verifyOTP = function (enteredOTP) {
  // Check if OTP is already used
  if (this.isUsed) {
    return { success: false, message: "OTP has already been used" };
  }

  // Check if OTP is expired
  if (new Date() > this.expiresAt) {
    return { success: false, message: "OTP has expired" };
  }

  // Check if max attempts exceeded
  if (this.attempts >= this.maxAttempts) {
    return {
      success: false,
      message:
        "Maximum verification attempts exceeded. Please request a new OTP",
    };
  }

  // Increment attempts
  this.attempts += 1;

  // Verify OTP
  if (this.otp === enteredOTP) {
    this.isUsed = true;
    return { success: true, message: "OTP verified successfully" };
  }

  return {
    success: false,
    message: `Invalid OTP. ${this.maxAttempts - this.attempts} attempts remaining`,
  };
};

const OTP = mongoose.models.OTP || mongoose.model("OTP", otpSchema);

export default OTP;
