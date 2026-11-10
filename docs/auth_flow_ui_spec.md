# Telnova Auth Flow + UI Spec (for Flutter AI)

This is the complete authentication reference for rebuilding auth in Flutter with parity to current web behavior.

## 1) Scope

Covers:

- Sign in
- Multi-step sign up
- OTP verification (phone or email)
- OTP resend with cooldown handling
- Session persistence
- Role-based post-login routing
- Logout

Base URL:

- `https://telnova.ai/api`

---

## 2) Auth Architecture

- Auth token is JWT in HTTP-only cookie named `token`.
- Signin response also includes `token` in JSON.
- API calls use `credentials: include` behavior on web; in Flutter, keep cookie jar/session persistence enabled.
- Profile endpoint (`GET /auth/me`) is source of truth for authenticated user.

Cookie settings (server):

- `httpOnly: true`
- `sameSite: strict`
- `secure: production only`
- `path: /`
- max age: 7 days

---

## 3) Complete Flow (End-to-End)

1. User opens app -> sees Sign in screen.
2. If user taps Create account -> goes to Signup flow (3 steps).
3. Step 1: enter account details.
4. Step 2: choose OTP channel (`phone` or `email`).
5. Signup API creates user + sends OTP on selected channel.
6. Step 3: user enters 6-digit OTP.
7. Verify API marks selected channel verified and activates account (`isActive = true` once either email or phone is verified).
8. User is redirected back to Sign in screen (`/?verified=true` on web).
9. User signs in with email/password.
10. App stores user session state and routes by role:

- `user` -> dashboard
- `admin` / `operator` / `partner` -> portal

11. App can refresh profile via `GET /auth/me`.
12. Logout clears cookie via `POST /auth/logout` and resets local auth state.

---

## 4) API Contracts

## 4.1 Signup

- `POST /auth/signup`
- Request:

```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "phoneNumber": "+1234567890",
  "verificationType": "phone"
}
```

- `verificationType` allowed: `email | phone` (default `phone`)
- Success `201`:

```json
{
  "success": true,
  "message": "User registered successfully. Please check your phone/email for verification code.",
  "user": { "_id": "...", "role": "user", "isActive": false, "...": "..." },
  "requiresVerification": true,
  "verificationType": "phone"
}
```

- Errors:
  - `400`: missing fields, invalid phone format, invalid verification type, validation errors
  - `409`: email/phone already exists
  - `500`: OTP send failure or internal error

## 4.2 Verify OTP

- `POST /auth/verify-otp`
- Request:

```json
{
  "userId": "string",
  "email": "string optional",
  "otp": "123456",
  "type": "phone"
}
```

- `type` allowed: `email | phone`
- Success `200`:

```json
{
  "success": true,
  "message": "Phone verified successfully",
  "user": {
    "emailVerified": false,
    "phoneVerified": true,
    "isActive": true,
    "...": "..."
  }
}
```

- Errors:
  - `400`: missing userId/otp, bad OTP, already verified, email mismatch
  - `404`: user not found
  - `500`: internal error

## 4.3 Resend OTP

- `POST /auth/resend-otp`
- Request:

```json
{
  "userId": "string",
  "email": "string optional",
  "type": "phone",
  "purpose": "verification"
}
```

- Success `200`:

```json
{
  "success": true,
  "message": "OTP sent successfully via SMS",
  "expiresAt": "2026-..."
}
```

- Cooldown `429`:

```json
{
  "success": false,
  "message": "An OTP was already sent...",
  "remainingSeconds": 170
}
```

- Other errors: `400`, `404`, `500`

## 4.4 Signin

- `POST /auth/signin`
- Request:

```json
{
  "email": "string",
  "password": "string"
}
```

- Success `200`:

```json
{
  "success": true,
  "message": "Login successful",
  "user": { "role": "user", "...": "..." },
  "token": "jwt"
}
```

- Errors:
  - `400`: missing email/password
  - `401`: invalid credentials
  - `500`: internal error

## 4.5 Profile

- `GET /auth/me`
- Requires auth cookie
- Success `200` -> `{ success: true, user: {...} }`
- Errors: `401`, `404`, `500`

## 4.6 Logout

- `POST /auth/logout`
- Success `200` -> cookie cleared

---

## 5) UI Approach (Current Web Pattern)

## 5.1 Shared Auth Shell

- Centered auth card layout.
- Brand row uses logo + “Telnova AI”.
- Optional badge on top (e.g., “Secure Authentication”).
- Title + subtitle + single content card.

Flutter equivalent:

- Reusable `AuthScaffold` widget with:
  - logo area
  - optional badge
  - title/subtitle
  - child form content

## 5.2 Sign in Screen

Fields:

- Email
- Password (show/hide toggle)

Actions:

- Sign in button (loading state: `Signing in...`)
- “Create one” link -> Signup flow
- “Forgot password” UI link exists but no backend flow yet

Behavior:

- On success: save user + token in state, route by role.
- Show toast/snackbar for success/failure.

## 5.3 Signup Screen (3-step wizard)

### Step 1 — Account Details

Fields:

- Full name
- Email
- Phone number (E.164 format)
- Password
- Confirm password

Live password requirement checklist:

- at least 8 chars
- uppercase letter
- lowercase letter
- number
- special char from `@$!%*?&`
- only letters/numbers/`@$!%*?&`

Validation:

- Confirm password must match.
- Continue button enabled only when fields valid.

### Step 2 — Verification Channel Selection

Two cards/options:

- Verify with Email
- Verify with Phone

Actions:

- Back -> Step 1
- Send code -> calls Signup API with selected `verificationType`

### Step 3 — OTP Entry

Field:

- OTP code (numeric keyboard, max length 6)

Text:

- “We sent a code to your phone/email. It expires in 5 minutes.”

Actions:

- Back -> Step 2
- Resend code -> calls Resend API
- Verify account -> calls Verify API

Rules:

- OTP required and must be 6 digits.
- On verify success, redirect to Sign in (web uses small delay).
- If resend returns 429, show wait message using `remainingSeconds`.

## 5.4 Step Indicator

Top indicator with 3 labels:

- Account
- Verification
- Code

State:

- completed/current badges highlighted
- upcoming badges muted

---

## 6) State Management Requirements

Required state fields:

- `user`
- `token`
- `isAuthenticated`
- `isLoading`
- `error`

Actions:

- `login(user, token)`
- `logout()` (calls `/auth/logout` and clears local state)
- `setUser(...)`
- `setLoading(...)`
- `setError(...)`

Persistence:

- Persist user/auth state across app relaunch.
- Hydrate state before rendering protected routes.

---

## 7) Navigation & Guards

Public routes:

- Sign in
- Signup flow

Protected routes:

- Dashboard (user role)
- Portal (admin/operator/partner)

Guard behavior:

- If not authenticated -> redirect to Sign in.
- After signin:
  - role `user` -> user dashboard
  - other roles -> portal

---

## 8) Error & UX Handling

Must show user-friendly messages for:

- invalid credentials
- duplicate email/phone (`409`)
- invalid OTP
- resend cooldown (`429` with minutes conversion)
- network failures

Loading states:

- disable buttons/inputs while requests are in flight
- button labels change (`Signing in...`, `Creating account...`, `Verifying...`)

---

## 9) Flutter Implementation Notes

Recommended stack:

- HTTP: `dio` + `cookie_jar` + `dio_cookie_manager`
- State: Riverpod or Bloc
- Routing: `go_router`
- Local persistence: `shared_preferences` or secure storage for mirrored state

Auth API repository should expose:

- `signup(...)`
- `verifyOtp(...)`
- `resendOtp(...)`
- `signin(...)`
- `getProfile()`
- `logout()`

---

## 10) Known Current Constraints

- No reset-password backend flow yet (UI link only).
- Signin UI has a `403` verification hint branch, but current signin API mainly returns `400/401/500`.
- Account activation depends on verification via either email or phone.

---

## 11) Minimal Acceptance Checklist

Flutter auth is accepted when:

- Signup works with both OTP channels (phone + email).
- OTP verify + resend + cooldown behavior matches backend.
- Signin sets session and role-based redirect works.
- Profile fetch works for existing session.
- Logout clears session and returns to signin.
- UI matches 3-step signup wizard approach with validation + loading/error states.
