import * as React from "react";

export function WelcomeEmailTemplate({ userName }) {
  return (
    <html>
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to Telnova AI</title>
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
                        <td align="center" style={{ paddingBottom: "24px" }}>
                          {/* Icon */}
                          <table
                            cellPadding="0"
                            cellSpacing="0"
                            border="0"
                            style={{
                              width: "80px",
                              height: "80px",
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              borderRadius: "50%",
                              backdropFilter: "blur(10px)",
                            }}
                          >
                            <tr>
                              <td
                                align="center"
                                valign="middle"
                                style={{
                                  fontSize: "40px",
                                  lineHeight: "80px",
                                  textAlign: "center",
                                }}
                              >
                                🎉
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
                              fontSize: "36px",
                              fontWeight: "700",
                              color: "#ffffff",
                              letterSpacing: "-0.5px",
                            }}
                          >
                            Welcome to Telnova AI!
                          </h1>
                          <p
                            style={{
                              margin: "16px 0 0 0",
                              fontSize: "18px",
                              color: "rgba(255, 255, 255, 0.9)",
                              fontWeight: "400",
                            }}
                          >
                            Your account is now active
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
                            Congratulations! Your email has been successfully
                            verified, and your Telnova AI account is now fully
                            activated. We're thrilled to have you join our
                            community of innovators leveraging AI technology.
                          </p>
                        </td>
                      </tr>

                      {/* CTA Button */}
                      <tr>
                        <td align="center" style={{ paddingBottom: "40px" }}>
                          <a
                            href="#"
                            style={{
                              display: "inline-block",
                              padding: "16px 40px",
                              backgroundColor: "#1e4a9b",
                              color: "#ffffff",
                              textDecoration: "none",
                              borderRadius: "8px",
                              fontSize: "16px",
                              fontWeight: "600",
                              boxShadow:
                                "0 4px 6px -1px rgba(99, 102, 241, 0.3)",
                            }}
                          >
                            Get Started →
                          </a>
                        </td>
                      </tr>

                      {/* Support Info */}
                      <tr>
                        <td
                          style={{
                            backgroundColor: "#f1f5f9",
                            padding: "24px",
                            borderRadius: "8px",
                            marginBottom: "32px",
                          }}
                        >
                          <p
                            style={{
                              margin: "0 0 8px 0",
                              fontSize: "15px",
                              fontWeight: "600",
                              color: "#000000",
                            }}
                          >
                            Need Help?
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              lineHeight: "1.6",
                              color: "#475569",
                            }}
                          >
                            Our support team is here to help! Reach out at{" "}
                            <a
                              href="mailto:support@telnova.ai"
                              style={{
                                color: "#1e4a9b",
                                textDecoration: "none",
                                fontWeight: "600",
                              }}
                            >
                              support@telnova.ai
                            </a>{" "}
                            or visit our{" "}
                            <a
                              href="#"
                              style={{
                                color: "#1e4a9b",
                                textDecoration: "none",
                                fontWeight: "600",
                              }}
                            >
                              Help Center
                            </a>
                          </p>
                        </td>
                      </tr>

                      {/* Closing */}
                      <tr>
                        <td>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "15px",
                              lineHeight: "1.6",
                              color: "#475569",
                            }}
                          >
                            Happy exploring!
                            <br />
                            <strong style={{ color: "#000000" }}>
                              The Telnova AI Team
                            </strong>
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
                              Unsubscribe
                            </a>
                          </p>
                        </td>
                      </tr>
                    </table>
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
