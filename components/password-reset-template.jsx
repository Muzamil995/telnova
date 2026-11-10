import * as React from "react";

export function PasswordResetTemplate({
  resetUrl,
  userName,
  expiryMinutes = 10,
}) {
  return (
    <html>
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset - Telnova AI</title>
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
          style={{ backgroundColor: "#f8fafc", padding: "32px 16px" }}
        >
          <tr>
            <td align="center">
              <table
                width="560"
                cellPadding="0"
                cellSpacing="0"
                border="0"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <tr>
                  <td
                    style={{
                      background:
                        "linear-gradient(135deg, #000000 0%, #1e4a9b 100%)",
                      padding: "32px",
                      textAlign: "center",
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        fontSize: "28px",
                        fontWeight: "700",
                        color: "#ffffff",
                      }}
                    >
                      Reset your password
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "32px" }}>
                    <p
                      style={{
                        margin: "0 0 14px 0",
                        fontSize: "16px",
                        color: "#0f172a",
                      }}
                    >
                      Hi {userName},
                    </p>
                    <p
                      style={{
                        margin: "0 0 20px 0",
                        fontSize: "15px",
                        lineHeight: "1.6",
                        color: "#334155",
                      }}
                    >
                      We received a request to reset your password. Click the
                      button below to choose a new one. This link expires in{" "}
                      {expiryMinutes} minutes.
                    </p>

                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      border="0"
                    >
                      <tr>
                        <td align="center" style={{ padding: "8px 0 24px" }}>
                          <a
                            href={resetUrl}
                            style={{
                              backgroundColor: "#1e4a9b",
                              borderRadius: "8px",
                              color: "#ffffff",
                              display: "inline-block",
                              fontSize: "15px",
                              fontWeight: "600",
                              lineHeight: "48px",
                              textAlign: "center",
                              textDecoration: "none",
                              width: "220px",
                            }}
                          >
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "13px",
                        lineHeight: "1.5",
                        color: "#64748b",
                      }}
                    >
                      If the button doesn&apos;t work, copy and paste this link
                      into your browser:
                    </p>
                    <p
                      style={{
                        margin: "0 0 24px 0",
                        fontSize: "13px",
                        lineHeight: "1.5",
                        color: "#1e4a9b",
                        wordBreak: "break-all",
                      }}
                    >
                      {resetUrl}
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        lineHeight: "1.6",
                        color: "#64748b",
                      }}
                    >
                      If you didn&apos;t request this, you can ignore this
                      email.
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
