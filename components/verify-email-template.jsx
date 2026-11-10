import * as React from "react";

export function VerifyEmailTemplate({ otp, userName, expiryMinutes }) {
  return (
    <html>
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email - Telnova AI</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f8fafc",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          border="0"
          style={{ backgroundColor: "#f8fafc", padding: "40px 20px" }}
        >
          <tr>
            <td align="center">
              {/* Main Container */}
              <table
                width="600"
                cellPadding="0"
                cellSpacing="0"
                border="0"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              >
                {/* Header with gradient */}
                <tr>
                  <td
                    style={{
                      background:
                        "linear-gradient(135deg, #1e4a9b 0%, #000000 100%)",
                      padding: "48px 40px",
                      textAlign: "center",
                    }}
                  >
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      border="0"
                    >
                      <tr>
                        <td align="center" style={{ paddingBottom: "20px" }}>
                          {/* Logo/Icon */}
                          <table
                            cellPadding="0"
                            cellSpacing="0"
                            border="0"
                            style={{
                              width: "72px",
                              height: "72px",
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              borderRadius: "16px",
                              backdropFilter: "blur(10px)",
                            }}
                          >
                            <tr>
                              <td
                                align="center"
                                valign="middle"
                                style={{
                                  fontSize: "36px",
                                  lineHeight: "72px",
                                  textAlign: "center",
                                }}
                              >
                                🔐
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <h1
                            style={{
                              margin: 0,
                              fontSize: "32px",
                              fontWeight: "700",
                              color: "#ffffff",
                              letterSpacing: "-0.5px",
                            }}
                          >
                            Verify Your Email
                          </h1>
                          <p
                            style={{
                              margin: "12px 0 0 0",
                              fontSize: "16px",
                              color: "rgba(255, 255, 255, 0.9)",
                              fontWeight: "400",
                            }}
                          >
                            Secure your account
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Content */}
                <tr>
                  <td style={{ padding: "48px 40px" }}>
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      border="0"
                    >
                      {/* Greeting */}
                      <tr>
                        <td>
                          <h2
                            style={{
                              margin: "0 0 16px 0",
                              fontSize: "24px",
                              fontWeight: "600",
                              color: "#000000",
                              lineHeight: "1.3",
                            }}
                          >
                            Hi {userName}! 👋
                          </h2>
                          <p
                            style={{
                              margin: "0 0 32px 0",
                              fontSize: "16px",
                              lineHeight: "1.6",
                              color: "#475569",
                            }}
                          >
                            Thank you for signing up with Telnova AI. To
                            complete your registration and activate your
                            account, please verify your email address using the
                            verification code below.
                          </p>
                        </td>
                      </tr>

                      {/* OTP Box */}
                      <tr>
                        <td>
                          <table
                            width="100%"
                            cellPadding="0"
                            cellSpacing="0"
                            border="0"
                            style={{
                              backgroundColor: "#f0f4ff",
                              border: "2px solid #1e4a9b",
                              borderRadius: "12px",
                              padding: "32px",
                              marginBottom: "32px",
                            }}
                          >
                            <tr>
                              <td align="center">
                                <p
                                  style={{
                                    margin: "0 0 16px 0",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#64748b",
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                  }}
                                >
                                  Your Verification Code
                                </p>
                                <div
                                  style={{
                                    fontSize: "48px",
                                    fontWeight: "700",
                                    color: "#1e4a9b",
                                    letterSpacing: "12px",
                                    fontFamily:
                                      'Monaco, Consolas, "Courier New", monospace',
                                    margin: "0 0 16px 0",
                                    textAlign: "center",
                                    lineHeight: "1",
                                  }}
                                >
                                  {otp}
                                </div>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "14px",
                                    color: "#64748b",
                                  }}
                                >
                                  ⏱️ Expires in{" "}
                                  <strong style={{ color: "#000000" }}>
                                    {expiryMinutes} minutes
                                  </strong>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      {/* Instructions */}
                      <tr>
                        <td>
                          <p
                            style={{
                              margin: "0 0 32px 0",
                              fontSize: "15px",
                              lineHeight: "1.6",
                              color: "#475569",
                              textAlign: "center",
                            }}
                          >
                            Enter this code on the verification page to activate
                            your account and start using Telnova AI.
                          </p>
                        </td>
                      </tr>

                      {/* Security Warning */}
                      <tr>
                        <td>
                          <table
                            width="100%"
                            cellPadding="0"
                            cellSpacing="0"
                            border="0"
                            style={{
                              backgroundColor: "#fef3c7",
                              borderLeft: "4px solid #f59e0b",
                              borderRadius: "8px",
                              padding: "20px 24px",
                              marginBottom: "32px",
                            }}
                          >
                            <tr>
                              <td>
                                <p
                                  style={{
                                    margin: "0 0 12px 0",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    color: "#92400e",
                                  }}
                                >
                                  🔒 Security Tips
                                </p>
                                <ul
                                  style={{
                                    margin: 0,
                                    padding: "0 0 0 20px",
                                    fontSize: "14px",
                                    lineHeight: "1.8",
                                    color: "#78350f",
                                  }}
                                >
                                  <li>Never share this code with anyone</li>
                                  <li>
                                    Telnova AI will never ask for your
                                    verification code
                                  </li>
                                  <li>
                                    This code is only valid for {expiryMinutes}{" "}
                                    minutes
                                  </li>
                                  <li>
                                    If you didn't request this, please ignore
                                    this email
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      {/* Help Text */}
                      <tr>
                        <td>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              lineHeight: "1.6",
                              color: "#64748b",
                              textAlign: "center",
                            }}
                          >
                            Having trouble? Contact our support team at{" "}
                            <a
                              href="mailto:support@telnova.ai"
                              style={{
                                color: "#1e4a9b",
                                textDecoration: "none",
                                fontWeight: "600",
                              }}
                            >
                              support@telnova.ai
                            </a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Divider */}
                <tr>
                  <td style={{ padding: "0 40px" }}>
                    <div
                      style={{
                        height: "1px",
                        backgroundColor: "#e2e8f0",
                      }}
                    ></div>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      padding: "32px 40px",
                      backgroundColor: "#f8fafc",
                      textAlign: "center",
                    }}
                  >
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      border="0"
                    >
                      <tr>
                        <td align="center">
                          <p
                            style={{
                              margin: "0 0 16px 0",
                              fontSize: "14px",
                              color: "#64748b",
                            }}
                          >
                            © {new Date().getFullYear()} Telnova AI. All rights
                            reserved.
                          </p>
                          <p style={{ margin: 0, fontSize: "13px" }}>
                            <a
                              href="#"
                              style={{
                                color: "#1e4a9b",
                                textDecoration: "none",
                                marginRight: "16px",
                              }}
                            >
                              Privacy Policy
                            </a>
                            <a
                              href="/terms-and-conditions"
                              style={{
                                color: "#1e4a9b",
                                textDecoration: "none",
                                marginRight: "16px",
                              }}
                            >
                              Terms & Conditions
                            </a>
                            <a
                              href="#"
                              style={{
                                color: "#1e4a9b",
                                textDecoration: "none",
                              }}
                            >
                              Help Center
                            </a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              {/* Footer Note */}
              <table
                width="600"
                cellPadding="0"
                cellSpacing="0"
                border="0"
                style={{ marginTop: "24px" }}
              >
                <tr>
                  <td align="center">
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "#94a3b8",
                        lineHeight: "1.5",
                      }}
                    >
                      This email was sent to you because you created an account
                      on Telnova AI.
                      <br />
                      If you didn't create this account, you can safely ignore
                      this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
