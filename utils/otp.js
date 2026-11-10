import crypto from "crypto";
import OTP from "@/models/otpModel";

/**
 * Generate a random OTP code
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} - Generated OTP
 */
export const generateOTP = (length = 6) => {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  return otp;
};

/**
 * Generate a secure random OTP using crypto
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} - Generated OTP
 */
export const generateSecureOTP = (length = 6) => {
  const buffer = crypto.randomBytes(length);
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += (buffer[i] % 10).toString();
  }

  return otp;
};

/**
 * Create and save OTP to database
 * @param {Object} params - OTP parameters
 * @param {string} params.userId - User ID
 * @param {string} params.email - User email (for email OTP)
 * @param {string} params.phoneNumber - User phone number (for phone OTP)
 * @param {string} params.type - OTP type ('email' or 'phone')
 * @param {string} params.purpose - OTP purpose (default: 'verification')
 * @param {number} params.expiryMinutes - OTP expiry time in minutes (default: 10)
 * @param {number} params.otpLength - Length of OTP (default: 6)
 * @returns {Promise<Object>} - Created OTP document
 */
export const createOTP = async ({
  userId,
  email,
  phoneNumber,
  type,
  purpose = "verification",
  expiryMinutes = 10,
  otpLength = 6,
}) => {
  try {
    // Validate required fields
    if (!userId || !type) {
      throw new Error("userId and type are required");
    }

    if (type === "email" && !email) {
      throw new Error("Email is required for email OTP");
    }

    if (type === "phone" && !phoneNumber) {
      throw new Error("Phone number is required for phone OTP");
    }

    // Delete any existing unused OTPs for this user and type
    await OTP.deleteMany({
      userId,
      type,
      purpose,
      isUsed: false,
    });

    // Generate OTP
    const otpCode = generateSecureOTP(otpLength);

    // Calculate expiry time
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Create OTP document
    const otpDocument = await OTP.create({
      userId,
      email: type === "email" ? email : undefined,
      phoneNumber: type === "phone" ? phoneNumber : undefined,
      otp: otpCode,
      type,
      purpose,
      expiresAt,
    });

    return {
      success: true,
      otp: otpCode,
      otpId: otpDocument._id,
      expiresAt,
    };
  } catch (error) {
    console.error("Create OTP error:", error);
    throw error;
  }
};

/**
 * Verify OTP
 * @param {Object} params - Verification parameters
 * @param {string} params.userId - User ID
 * @param {string} params.otp - OTP to verify
 * @param {string} params.type - OTP type ('email' or 'phone')
 * @param {string} params.purpose - OTP purpose (default: 'verification')
 * @returns {Promise<Object>} - Verification result
 */
export const verifyOTP = async ({
  userId,
  otp,
  type,
  purpose = "verification",
}) => {
  try {
    // Find the latest OTP for this user, type, and purpose
    const otpDocument = await OTP.findOne({
      userId,
      type,
      purpose,
      isUsed: false,
    }).sort({ createdAt: -1 });

    if (!otpDocument) {
      return {
        success: false,
        message: "No valid OTP found. Please request a new one",
      };
    }

    // Verify OTP using model method
    const verificationResult = otpDocument.verifyOTP(otp);

    // Save the updated document (attempts incremented, isUsed updated)
    await otpDocument.save();

    return verificationResult;
  } catch (error) {
    console.error("Verify OTP error:", error);
    throw error;
  }
};

/**
 * Check if user has a valid unused OTP
 * @param {Object} params - Check parameters
 * @param {string} params.userId - User ID
 * @param {string} params.type - OTP type ('email' or 'phone')
 * @param {string} params.purpose - OTP purpose (default: 'verification')
 * @returns {Promise<boolean>} - Whether valid OTP exists
 */
export const hasValidOTP = async ({
  userId,
  type,
  purpose = "verification",
}) => {
  try {
    const otpDocument = await OTP.findOne({
      userId,
      type,
      purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    return !!otpDocument;
  } catch (error) {
    console.error("Check valid OTP error:", error);
    return false;
  }
};

/**
 * Delete all OTPs for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteUserOTPs = async (userId) => {
  try {
    await OTP.deleteMany({ userId });
    return { success: true, message: "All OTPs deleted" };
  } catch (error) {
    console.error("Delete user OTPs error:", error);
    throw error;
  }
};

/**
 * Get remaining time for OTP expiry
 * @param {Object} params - Parameters
 * @param {string} params.userId - User ID
 * @param {string} params.type - OTP type ('email' or 'phone')
 * @param {string} params.purpose - OTP purpose (default: 'verification')
 * @returns {Promise<Object>} - Remaining time info
 */
export const getOTPRemainingTime = async ({
  userId,
  type,
  purpose = "verification",
}) => {
  try {
    const otpDocument = await OTP.findOne({
      userId,
      type,
      purpose,
      isUsed: false,
    }).sort({ createdAt: -1 });

    if (!otpDocument) {
      return { success: false, message: "No OTP found" };
    }

    const now = new Date();
    const expiresAt = otpDocument.expiresAt;

    if (now > expiresAt) {
      return { success: false, message: "OTP has expired" };
    }

    const remainingSeconds = Math.floor((expiresAt - now) / 1000);

    return {
      success: true,
      remainingSeconds,
      expiresAt,
    };
  } catch (error) {
    console.error("Get OTP remaining time error:", error);
    throw error;
  }
};
