# Telnova AI Agent — Complete Working Specification

This document explains exactly how the current Telnova AI support agent works so a mobile-app AI can replicate the same behavior.

## 1) Purpose

The agent supports Telnova customers for:

- Internet
- TV
- Mobile
- Home security
- Account and subscription
- Onboarding and billing
- Product usage questions

Primary goals:

- Answer quickly and accurately.
- Prefer FAQ-based deterministic answers when confidence is high.
- Fall back to model-generated answers when FAQ match is weak.
- Escalate to human support by creating tickets when needed.

---

## 2) Runtime Components

### Backend agent endpoint

- Endpoint: `POST https://telnova.ai/api/support/chat`
- File: `app/api/support/chat/route.js`

### Knowledge base

- File: `data/support-faq.json`
- Contains:
  - `supportPhone` (currently `(866) 335-0202`)
  - `faqs[]` (currently 50 FAQ pairs with `id`, `question`, `answer`)

### Model provider

- OpenAI Responses API
- Env vars:
  - `OPENAI_API_KEY` (required)
  - `OPENAI_MODEL` (optional; defaults to `gpt-4.1-mini`)

### Ticket escalation endpoint

- Endpoint: `POST https://telnova.ai/api/support/ticket`
- File: `app/api/support/ticket/route.js`

### Frontend chat orchestrator (current web behavior)

- File: `components/dashboard/chat-interface.jsx`
- Controls when to call chat API vs ticket API.

---

## 3) Security & Access Rules

All support chat and ticket calls require authenticated session cookie:

- Cookie name: `token`
- Valid JWT required.
- Unauthorized/invalid token => `401`.

For mobile parity:

- Persist cookies (`Set-Cookie`) and send them on each API request.
- If cookie jar is unavailable, send `Cookie: token=<jwt>` from sign-in token.

---

## 4) Agent Input Normalization

Before processing, server normalizes incoming messages:

- Accepts only roles: `user`, `assistant`.
- Keeps only last 20 messages.
- Trims each message to max 4000 chars.
- Drops empty content.

If resulting message list is empty:

- Returns `400` with message: `At least one valid message is required`.

---

## 5) Decision Pipeline (Server)

The support AI endpoint executes this sequence:

1. Validate OpenAI key and auth token.
2. Normalize messages.
3. Extract latest `user` message.
4. Try **direct service-issue FAQ shortcut**.
5. If no direct match, run **semantic FAQ matching**.
6. If FAQ confidence >= threshold, return FAQ answer.
7. Else call OpenAI model with system instructions and conversation.
8. Return final assistant message.

### Confidence threshold

- `FAQ_MATCH_THRESHOLD = 0.58`

---

## 6) FAQ Matching Logic

### Text normalization

- Lowercase
- Remove non-alphanumeric chars
- Collapse spaces

### Service-type inference

Detects from query keywords:

- `internet`: internet, wifi, broadband, router, modem
- `tv`: tv, television, set top box, channels
- `mobile`: mobile, cell, data, signal, calls

### Service-issue signal detector

Flags outage-like issues from words/phrases like:

- not working
- down
- no service
- no internet
- not connecting
- keeps dropping
- intermittent

### Direct issue shortcut

If a service-issue signal is present and service type is inferred:

- internet => FAQ `id=1`
- tv => FAQ `id=2`
- mobile => FAQ `id=16`, fallback `id=17`

If found, response is immediate with:

- `source: "faq-direct-intent"`
- `confidence: 0.99`

### Semantic FAQ matching

For every FAQ question:

- Tokenize normalized text.
- Build semantic tokens:
  - Adds `service_<type>` when service inferred.
  - Adds `issue_down` when issue signal exists.
- Compute Jaccard score between query tokens and FAQ tokens.
- Boost +0.14 when service type matches.
- Boost +0.14 when both have issue signals.
- If exact/contains-style close match, floor score to `0.98`.

Best FAQ is selected. If score >= `0.58`:

- Return FAQ answer with:
  - `source: "faq"`
  - `faqId`
  - `confidence` rounded to 2 decimals

### Support phone enrichment

For FAQ answers, if `supportPhone` is not already in answer, append:

- `For immediate assistance, call our support team at <supportPhone>.`

---

## 7) OpenAI Fallback Behavior

If FAQ stage does not return an answer, server calls OpenAI with:

- `model = OPENAI_MODEL || "gpt-4.1-mini"`
- `instructions = SYSTEM_PROMPT`
- `input = normalized messages`

System instruction intent (summarized):

- Act as Telnova AI support.
- Be concise, accurate, action-oriented.
- Treat clear service failures as valid support requests.
- Do not ask unnecessary “is this Telnova-related?” questions.
- Ask minimum follow-up details.
- Suggest human support next steps when needed.

Output extraction strategy:

- First try `response.output_text`.
- Else parse message/output_text blocks.
- If no assistant text found => `502 No response generated`.

---

## 8) Ticket Escalation Logic (Client Orchestration)

The web chat UI decides whether to escalate to ticket creation **before** calling `/support/chat`.

### Escalation triggers

A ticket is created if user message contains intent keywords like:

- create ticket
- need assistance / need help
- representative / human support
- talk/speak to someone / agent
- live chat / live support

Or unresolved-issue phrases like:

- still not working
- still down / broken
- not fixed / not resolved
- issue continues / nothing worked

Or user confirms AI escalation suggestion:

- Previous AI message contains one of:
  - create a ticket
  - open a ticket
  - escalate
  - contact our support team
- and user reply includes: `yes`, `ok`, `okay`

### On successful ticket creation

- Appends assistant message:
  - `Your support ticket <ticketNumber> has been created. Our representative will contact you shortly.`
- Marks chat as closed (`isChatClosed = true`).

### Ticket API payload

`POST /api/support/ticket`

```json
{
  "conversationHistory": [
    { "role": "user|assistant", "content": "...", "timestamp": "..." }
  ]
}
```

The initial static greeting message is excluded from ticket history.

---

## 9) Ticket Auto-Classification Rules (Server)

When ticket is created, backend classifies:

### Category detection

Keyword-frequency scoring across all **user** messages.
Top category wins among:

- Internet/Connectivity Issues
- TV Service Issues
- Mobile Service Issues
- Billing & Payments
- Installation & Technician
- Equipment & Hardware
- Account Management
- Service Changes
- Other (fallback)

### Priority detection

Across full conversation text:

- `urgent` if contains urgent keywords (`urgent`, `emergency`, `critical`, `asap`, `down`, `outage`, `not working`, etc.)
- else `high` if contains high keywords (`important`, `soon`, `quickly`, `problem`, `issue`, etc.)
- else `high` if category is Internet/Connectivity or Billing & Payments
- else `medium`

Ticket number format:

- `TN` + year + month + trailing timestamp digits

---

## 10) API Response Shapes

### Support chat success

```json
{
  "success": true,
  "message": "assistant text",
  "source": "faq-direct-intent|faq (optional)",
  "faqId": 1,
  "confidence": 0.99
}
```

### Support chat errors

- `400` invalid/empty messages
- `401` auth/token issues
- `500` internal or missing API key
- `502` model produced no extractable message

### Ticket create success

```json
{
  "success": true,
  "ticket": {
    "ticketNumber": "TN...",
    "category": "...",
    "priority": "...",
    "status": "open",
    "createdAt": "..."
  }
}
```

---

## 11) Mobile Implementation Requirements (Must Match)

To replicate current behavior in mobile app:

- Use same endpoint sequence and auth cookie behavior.
- Keep message normalization constraints (role filtering, last 20, trim).
- Implement same escalation trigger keywords.
- Call `/support/ticket` directly when escalation triggers.
- Close chat after ticket creation.
- Preserve FAQ-first logic from backend responses (`source`, `faqId`, `confidence`).
- Play notification sound on assistant response (optional UX parity but currently in web app).

---

## 12) Quick End-to-End Flow

1. User sends message.
2. Client checks `shouldCreateTicket(...)`.
3. If true => create ticket and close chat.
4. If false => call `/support/chat`.
5. Server attempts direct FAQ match.
6. Else semantic FAQ match.
7. Else OpenAI fallback.
8. Client displays response and continues conversation.

---

## 13) Notes / Current Constraints

- FAQ matching is deterministic and text-based (not embeddings).
- FAQ direct mapping depends on specific FAQ IDs (1,2,16,17).
- Chat API does not stream partial tokens; it returns full response only.
- Support phone is centrally controlled via `data/support-faq.json`.

If you change FAQ IDs or structure, update direct mapping logic in `app/api/support/chat/route.js` accordingly.
