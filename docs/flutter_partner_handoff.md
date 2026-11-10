# Flutter Partner Portal Handoff

> Features absent from `flutter_app_handoff.json`. Added post-Feb 2026.
> Roles covered: **partner**, **admin**, **operator** (where noted).

---

## Roles & Access

| Module                    | Allowed Roles |
| ------------------------- | ------------- |
| Partner Portal Overview   | `partner`     |
| Partner Settings          | `partner`     |
| Withdrawal Request        | `partner`     |
| TFN Statement Request     | `partner`     |
| Admin – Partners List     | `admin`       |
| Admin – Partner Details   | `admin`       |
| Admin – Withdrawals Queue | `admin`       |
| Admin – Statements Queue  | `admin`       |

---

## Data Models

### Partner

Source: `models/partnerModel.js`

| Field            | Type            | Notes            |
| ---------------- | --------------- | ---------------- |
| `_id`            | ObjectId        |                  |
| `user`           | ObjectId → User | unique, indexed  |
| `partnerName`    | string          | required         |
| `partnerTFN`     | string          | unique, required |
| `currentBalance` | number          | min 0            |
| `totalWithdrawn` | number          | min 0            |
| `paymentMethod`  | object          | see below        |
| `createdAt`      | datetime        |                  |
| `updatedAt`      | datetime        |                  |

**`paymentMethod` sub-object**

```
type: "paypal" | "bank" | null
paypalEmail: string
bankDetails:
  accountHolderName: string
  bankName: string
  accountNumber: string
  routingNumber: string
  accountType: "checking" | "savings"
```

### PartnerWithdrawal

Source: `models/partnerWithdrawalModel.js`

| Field           | Type                    | Notes                              |
| --------------- | ----------------------- | ---------------------------------- |
| `_id`           | ObjectId                |                                    |
| `partner`       | ObjectId → Partner      |                                    |
| `user`          | ObjectId → User         |                                    |
| `partnerName`   | string                  | snapshot                           |
| `partnerTFN`    | string                  | snapshot                           |
| `amount`        | number                  | min 0.01                           |
| `paymentMethod` | object                  | snapshot of method at request time |
| `status`        | `pending` \| `paid`     |                                    |
| `requestedAt`   | datetime                |                                    |
| `paidAt`        | datetime \| null        |                                    |
| `paidBy`        | ObjectId → User \| null | admin who marked paid              |
| `notes`         | string                  | max 500 chars                      |

### PartnerStatementRequest

Source: `models/partnerStatementRequestModel.js`

| Field         | Type                     | Notes         |
| ------------- | ------------------------ | ------------- |
| `_id`         | ObjectId                 |               |
| `partner`     | ObjectId → Partner       |               |
| `user`        | ObjectId → User          |               |
| `partnerName` | string                   | snapshot      |
| `partnerTFN`  | string                   | snapshot      |
| `status`      | `pending` \| `delivered` |               |
| `requestedAt` | datetime                 |               |
| `deliveredAt` | datetime \| null         |               |
| `deliveredBy` | ObjectId → User \| null  |               |
| `notes`       | string                   | max 500 chars |

---

## API Endpoints

Base URL: `https://telnova.ai/api`  
Auth: cookie `token` (same pattern as main handoff).

---

### Partner-facing (role: `partner`)

#### GET `/partners/me`

Get own partner profile + withdrawal history.

**Response**

```json
{
  "success": true,
  "partner": {
    "_id": "string",
    "partnerName": "string",
    "partnerTFN": "string",
    "currentBalance": 0,
    "totalWithdrawn": 0,
    "paymentMethod": { ... },
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

#### PATCH `/partners/payment-method`

Save/update payment method.

**Request**

```json
{
  "paymentMethod": {
    "type": "paypal | bank",
    "paypalEmail": "string (if paypal)",
    "bankDetails": {
      "accountHolderName": "string",
      "bankName": "string",
      "accountNumber": "string",
      "routingNumber": "string",
      "accountType": "checking | savings"
    }
  }
}
```

**Response**

```json
{ "success": true, "partner": { ... } }
```

**Errors:** 400, 401, 403, 500

---

#### PATCH `/partners/password`

Change partner password.

**Request**

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response**

```json
{ "success": true, "message": "Password updated successfully" }
```

**Errors:** 400, 401, 403, 500

---

#### POST `/partners/withdrawals`

Request a withdrawal. Partner must have `currentBalance > $50`.

**Request**

```json
{ "amount": 75.0 }
```

> `amount` must be positive and ≤ `partner.currentBalance`.

**Response (201)**

```json
{
  "success": true,
  "withdrawal": {
    "_id": "string",
    "amount": 75.0,
    "status": "pending",
    "requestedAt": "datetime"
  }
}
```

**Errors:** 400 (insufficient balance / invalid amount), 401, 403, 500

---

#### GET `/partners/withdrawals`

Get own withdrawal history.

**Response**

```json
{
  "success": true,
  "withdrawals": [ ...PartnerWithdrawal ],
  "count": 5
}
```

**Errors:** 401, 403, 500

---

#### POST `/partners/statements`

Request TFN statement document.

**Request:** `{}` (no body — partner identity resolved from session)

**Response (201)**

```json
{
  "success": true,
  "statement": {
    "_id": "string",
    "status": "pending",
    "requestedAt": "datetime"
  }
}
```

**Errors:** 400, 401, 403, 500

---

### Admin-facing (role: `admin`)

#### GET `/admin/partners?page=1&limit=20&search=`

Paginated partner list.

**Response**

```json
{
  "success": true,
  "partners": [ ...Partner ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 92,
    "limit": 20
  }
}
```

**Errors:** 401, 403, 500

---

#### POST `/admin/partners`

Create new partner (creates User + Partner records).

**Request**

```json
{
  "fullName": "string",
  "email": "string",
  "phoneNumber": "string E.164",
  "partnerName": "string",
  "partnerTFN": "string"
}
```

**Response (201)**

```json
{
  "success": true,
  "partner": { ... },
  "user": { ... },
  "temporaryPassword": "string"
}
```

**Errors:** 400, 401, 403, 409, 500

---

#### GET `/admin/partners/{partnerId}`

Single partner detail + withdrawal history.

**Response**

```json
{
  "success": true,
  "partner": { ...Partner, "withdrawals": [ ...PartnerWithdrawal ] }
}
```

**Errors:** 400, 401, 403, 404, 500

---

#### PATCH `/admin/partners/{partnerId}`

Update partner balance.

**Request**

```json
{ "currentBalance": 150.0 }
```

**Response**

```json
{ "success": true, "partner": { ... } }
```

**Errors:** 400, 401, 403, 404, 500

---

#### GET `/admin/partners/withdrawals?status=pending&limit=50`

All withdrawal requests, filterable by status.

| Query param | Values              | Default   |
| ----------- | ------------------- | --------- |
| `status`    | `pending` \| `paid` | `pending` |
| `limit`     | number              | 50        |

**Response**

```json
{
  "success": true,
  "withdrawals": [ ...PartnerWithdrawal ],
  "count": 12
}
```

**Errors:** 401, 403, 500

---

#### PATCH `/admin/partners/withdrawals/{withdrawalId}`

Mark withdrawal as paid.

**Request**

```json
{ "notes": "string (optional)" }
```

**Response**

```json
{
  "success": true,
  "withdrawal": {
    "_id": "string",
    "status": "paid",
    "paidAt": "datetime",
    "paidBy": "userId"
  }
}
```

**Errors:** 400, 401, 403, 404, 500

---

#### GET `/admin/partners/statements?status=pending&limit=50`

All TFN statement requests, filterable by status.

| Query param | Values                   | Default   |
| ----------- | ------------------------ | --------- |
| `status`    | `pending` \| `delivered` | `pending` |
| `limit`     | number                   | 50        |

**Response**

```json
{
  "success": true,
  "statements": [ ...PartnerStatementRequest ],
  "count": 4
}
```

**Errors:** 401, 403, 500

---

#### PATCH `/admin/partners/statements/{statementId}`

Mark TFN statement as delivered.

**Request**

```json
{ "notes": "string (optional)" }
```

**Response**

```json
{
  "success": true,
  "statement": {
    "_id": "string",
    "status": "delivered",
    "deliveredAt": "datetime",
    "deliveredBy": "userId"
  }
}
```

**Errors:** 400, 401, 403, 404, 500

---

## Business Rules

| Rule                        | Detail                                                                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Min withdrawal**          | `currentBalance > $50` (`MIN_PARTNER_WITHDRAWAL_BALANCE = 50`)                                                                   |
| **Withdrawal amount**       | Must be positive AND ≤ `currentBalance`                                                                                          |
| **Payment method required** | Withdrawal blocked if no saved payment method                                                                                    |
| **Payment method types**    | `paypal` (email only) or `bank` (full bank details)                                                                              |
| **TFN uniqueness**          | `partnerTFN` unique across all partners                                                                                          |
| **Balance deduction**       | Only the requested `amount` deducted — not full balance                                                                          |
| **Withdrawal status flow**  | `pending` → `paid` (admin action, irreversible)                                                                                  |
| **Statement status flow**   | `pending` → `delivered` (admin action, irreversible)                                                                             |
| **Snapshots**               | `paymentMethod`, `partnerName`, `partnerTFN` snapshot at withdrawal creation — changes to profile don't affect existing requests |

---

## Flutter Screens

### F09 – Partner Overview (role: `partner`)

- Show `currentBalance`, `totalWithdrawn`
- Show payment method summary (e.g. `PayPal (user@mail.com)` or `Chase Bank (checking, ****4321)`)
- Button → Request Withdrawal (disabled if balance ≤ $50 or no payment method)
- Button → Request TFN Statement
- List recent withdrawals with status pills

### F10 – Partner Settings (role: `partner`)

- Two sections: **Payment Method** + **Change Password**
- Payment method: toggle between PayPal (email field) and Bank (5 fields)
- Validate all bank fields non-empty before save
- Change password: `currentPassword`, `newPassword`, `confirmPassword`
- Password policy same as signup (min 8, upper, lower, number, special `@$!%*?&`)

### F11 – Withdrawal Request Dialog (role: `partner`)

- Amount input (numeric, max = `currentBalance`)
- Show selected payment method summary
- Confirm → POST `/partners/withdrawals`
- On success: refresh balance, show `pending` status in history

### F12 – TFN Statement Request (role: `partner`)

- Confirmation dialog only
- POST `/partners/statements`
- Show `pending` in history after success

### F13 – Admin Partners List (role: `admin`)

- Paginated + searchable table
- Columns: `partnerName`, `partnerTFN`, `currentBalance`, `totalWithdrawn`, `paymentMethod type`, `createdAt`
- Tap row → Partner Detail screen
- FAB → Create Partner dialog

### F14 – Admin Partner Detail (role: `admin`)

- Show full partner fields
- Balance editor (PATCH balance)
- Withdrawal history table with status

### F15 – Admin Withdrawals Queue (role: `admin`)

- Filter by `status` (`pending` / `paid`)
- Columns: partner name, TFN, amount, payment method snapshot, `requestedAt`
- Action: Mark as Paid (irreversible — confirm dialog)
- Notes field on mark-paid

### F16 – Admin Statements Queue (role: `admin`)

- Filter by `status` (`pending` / `delivered`)
- Columns: partner name, TFN, `requestedAt`
- Action: Mark as Delivered (irreversible — confirm dialog)
- Notes field on mark-delivered

---

## Status Pill Colors

| Status      | Color                          |
| ----------- | ------------------------------ |
| `pending`   | amber / `#92400e` on `#FEF3C7` |
| `paid`      | green / `#15803D` on `#DCFCE7` |
| `delivered` | green / `#15803D` on `#DCFCE7` |

---

## Source Files (Web App Reference)

| File                                       | Purpose                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| `app/portal/page.jsx`                      | Partner/admin overview + withdrawal + statement UI                      |
| `app/portal/partner-settings/page.jsx`     | Payment method + password settings                                      |
| `app/portal/partners/page.jsx`             | Admin partner list                                                      |
| `app/portal/partners/[partnerId]/page.jsx` | Admin partner detail                                                    |
| `models/partnerModel.js`                   | Partner schema                                                          |
| `models/partnerWithdrawalModel.js`         | Withdrawal schema                                                       |
| `models/partnerStatementRequestModel.js`   | Statement request schema                                                |
| `lib/api.js` → `partnersAPI`               | All partner API calls                                                   |
| `lib/partner-utils.js`                     | Business rule helpers (`isEligibleForWithdrawal`, payment method utils) |
| `app/api/partners/`                        | Partner-facing route handlers                                           |
| `app/api/admin/partners/`                  | Admin-facing route handlers                                             |
