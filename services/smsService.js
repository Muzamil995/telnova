/**
 * SMS Service for sending OTPs via Twilio
 */

import twilio from "twilio";

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

/**
 * Send OTP via SMS
 * @param {Object} params - SMS parameters
 * @param {string} params.to - Recipient phone number (E.164 format)
 * @param {string} params.otp - OTP code
 * @param {string} params.userName - User's name
 * @param {number} params.expiryMinutes - OTP expiry time in minutes
 * @returns {Promise<Object>} - Send result
 */
export const sendOTPSMS = async ({
  to,
  otp,
  userName = "User",
  expiryMinutes = 10,
}) => {
  try {
    // Validate Twilio configuration
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error("Twilio credentials not configured");
    }

    if (!TWILIO_PHONE_NUMBER) {
      throw new Error("Twilio phone number not configured");
    }

    const message = await client.messages.create({
      body: getOTPSMSText({ otp, userName, expiryMinutes }),
      from: TWILIO_PHONE_NUMBER,
      to: to,
    });

    return {
      success: true,
      messageId: message.sid,
      message: "OTP sent successfully via SMS",
      status: message.status,
    };
  } catch (error) {
    console.error("Send OTP SMS error:", error);
    return {
      success: false,
      message: error.message || "Failed to send SMS",
      error: error,
    };
  }
};

/**
 * Send generic SMS
 * @param {Object} params - SMS parameters
 * @param {string} params.to - Recipient phone number
 * @param {string} params.body - Message body
 * @param {string} params.from - Sender phone number (optional)
 * @returns {Promise<Object>} - Send result
 */
export const sendSMS = async ({ to, body, from = TWILIO_PHONE_NUMBER }) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error("Twilio credentials not configured");
    }

    const message = await client.messages.create({
      body,
      from,
      to,
    });

    return {
      success: true,
      messageId: message.sid,
      message: "SMS sent successfully",
      status: message.status,
    };
  } catch (error) {
    console.error("Send SMS error:", error);
    return {
      success: false,
      message: error.message || "Failed to send SMS",
      error: error,
    };
  }
};

// SMS Templates

/**
 * Get OTP SMS text template
 * @param {Object} params - Template parameters
 * @param {string} params.otp - OTP code
 * @param {string} params.userName - User's name
 * @param {number} params.expiryMinutes - OTP expiry time
 * @returns {string} - SMS text
 */
const getOTPSMSText = ({ otp, userName, expiryMinutes }) => {
  return `Hi ${userName}!\n\nYour Telnova AI verification code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.\n\nNever share this code with anyone.\n\n- Telnova AI Team`;
};
