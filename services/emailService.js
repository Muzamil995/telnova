import { VerifyEmailTemplate } from "@/components/verify-email-template";
import { WelcomeEmailTemplate } from "@/components/welcome-email-template";
import { PasswordResetTemplate } from "@/components/password-reset-template";
import { Resend } from "resend";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender addresses for different types of emails
const DEFAULT_SENDER = process.env.EMAIL_FROM || "onboarding@resend.dev";
const VERIFY_SENDER = "verify@telnova.ai";
const WELCOME_SENDER = "welcome@telnova.ai";
const RESET_SENDER = "reset@telnova.ai";

/**
 * Send OTP verification email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.otp - OTP code
 * @param {string} params.userName - User's name
 * @param {number} params.expiryMinutes - OTP expiry time in minutes
 * @returns {Promise<Object>} - Send result
 */
export const sendOTPEmail = async ({
  to,
  otp,
  userName = "User",
  expiryMinutes = 5,
}) => {
  try {
    const data = await resend.emails.send({
      from: VERIFY_SENDER,
      to: [to],
      subject: "Verify Your Email - Telnova AI",
      react: VerifyEmailTemplate({ otp, userName, expiryMinutes }),
    });

    return {
      success: true,
      messageId: data.id,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("Send OTP email error:", error);
    return {
      success: false,
      message: error.message || "Failed to send email",
    };
  }
};

/**
 * Send welcome email after successful verification
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.userName - User's name
 * @returns {Promise<Object>} - Send result
 */
export const sendWelcomeEmail = async ({ to, userName }) => {
  try {
    const data = await resend.emails.send({
      from: WELCOME_SENDER,
      to: [to],
      subject: "Welcome to Telnova AI!",
      react: WelcomeEmailTemplate({ userName }),
    });

    return {
      success: true,
      messageId: data.id,
      message: "Welcome email sent successfully",
    };
  } catch (error) {
    console.error("Send welcome email error:", error);
    return {
      success: false,
      message: error.message || "Failed to send email",
    };
  }
};

/**
 * Send password reset email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.resetUrl - Password reset URL
 * @param {string} params.userName - User's name
 * @param {number} params.expiryMinutes - Reset link expiry time in minutes
 * @returns {Promise<Object>} - Send result
 */
export const sendPasswordResetEmail = async ({
  to,
  resetUrl,
  userName = "User",
  expiryMinutes = 10,
}) => {
  try {
    if (!resetUrl) {
      return {
        success: false,
        message: "Reset URL is required",
      };
    }

    const data = await resend.emails.send({
      from: RESET_SENDER,
      to: [to],
      subject: "Password Reset Request - Telnova AI",
      react: PasswordResetTemplate({ resetUrl, userName, expiryMinutes }),
    });

    return {
      success: true,
      messageId: data.id,
      message: "Password reset email sent successfully",
    };
  } catch (error) {
    console.error("Send password reset email error:", error);
    return {
      success: false,
      message: error.message || "Failed to send email",
    };
  }
};

/**
 * Generic email sending function
 * @param {Object} params - Email parameters
 * @param {string|string[]} params.to - Recipient email(s)
 * @param {string} params.subject - Email subject
 * @param {string} params.html - Email HTML content
 * @param {string} params.from - Sender email (optional)
 * @returns {Promise<Object>} - Send result
 */
export const sendEmail = async ({
  to,
  subject,
  html,
  from = DEFAULT_SENDER,
}) => {
  try {
    const data = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    return {
      success: true,
      messageId: data.id,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Send email error:", error);
    return {
      success: false,
      message: error.message || "Failed to send email",
    };
  }
};
