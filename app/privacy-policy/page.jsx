"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Icon from "@/components/landing/Icon";
import {
  C,
  HL,
  BD,
  SHADOW,
  VIEWPORT,
  fadeUp,
  stagger,
} from "@/components/landing/tokens";

const COMMITMENTS = [
  {
    icon: "shield",
    title: "Minimal Collection",
    text: "We collect only information reasonably needed to respond, support, and deliver requested services.",
  },
  {
    icon: "sell",
    title: "No Data Sales",
    text: "We do not sell, rent, or lease personal information and do not share it for third-party marketing.",
  },
  {
    icon: "lock",
    title: "Controlled Access",
    text: "Access is limited to authorized personnel, contractors, and service providers with legitimate business needs.",
  },
];

const POLICY_SECTIONS = [
  {
    number: "0",
    title: "Scope and Acceptance",
    body: [
      'This Privacy Policy explains how we collect, use, store, disclose, and protect information when you visit or use our website, services, forms, tools, and communications, collectively called "Site."',
      "By accessing or using Site, you acknowledge that you have read and understood this Privacy Policy.",
    ],
  },
  {
    number: "1",
    title: "Our Privacy Commitment",
    body: [
      "At Telnova.ai, protecting your privacy is a priority. We take a stricter approach to privacy and data handling.",
    ],
    bullets: [
      "We collect only the information we reasonably need.",
      "We do not sell, rent, or lease your personal information.",
      "We do not share your personal information with third parties for their own independent marketing purposes.",
      "We limit access to personal information to authorized personnel, contractors, and service providers who need it to perform legitimate business functions.",
      "We retain personal information only for as long as reasonably necessary for business, legal, security, or compliance purposes.",
    ],
  },
  {
    number: "2",
    title: "Information We Collect",
    groups: [
      {
        heading: "A. Information You Voluntarily Provide",
        text: "We collect personal information you choose to provide when you submit a contact form, request a quote or consultation, sign up for newsletters or updates, communicate by email, phone, chat, or web form, participate in surveys or campaigns, or request support.",
        bullets: [
          "Full name",
          "Business name",
          "Email address",
          "Phone number",
          "Service address",
          "Billing or mailing address",
          "Product or service interests",
          "Account or service preferences",
          "Any other information you include in your message or submission",
        ],
      },
      {
        heading: "B. Information Collected Automatically",
        text: "When you use Site, we may automatically collect technical and usage information.",
        bullets: [
          "IP address",
          "Browser type and version",
          "Device type",
          "Operating system",
          "Domain name",
          "Pages visited",
          "Time spent on pages",
          "Referral URLs",
          "Date and time of access",
          "Clickstream and interaction data",
          "Cookie and similar technology data",
        ],
      },
      {
        heading: "C. Limited Analytics and Preference Data",
        text: "We may collect limited information about interests, preferences, and interactions with Site to improve experience, measure performance, prevent abuse, and better understand which services are most relevant to visitors.",
      },
      {
        heading: "D. Sensitive Information",
        text: "We do not intentionally request or collect sensitive personal information unless reasonably necessary for a specific lawful purpose and voluntarily provided by you. Do not submit sensitive personal information unless specifically requested and necessary.",
      },
    ],
  },
  {
    number: "3",
    title: "How We Use Your Information",
    bullets: [
      "Operate, maintain, and improve Site",
      "Respond to inquiries and provide customer support",
      "Provide quotes, recommendations, service options, and requested information",
      "Contact you regarding products or services you requested",
      "Process transactions or service-related requests",
      "Detect, prevent, and investigate fraud, abuse, unauthorized access, or other security issues",
      "Comply with legal obligations and enforce our terms",
      "Maintain records for internal business purposes",
      "Analyze traffic, performance, and user engagement",
      "Send administrative notices, service updates, or legally required communications",
      "Send promotional communications only where permitted by law or where you have provided consent",
    ],
    footer:
      "We do not use personal information in a manner materially different from purposes described here without updating this Policy or obtaining consent where required.",
  },
  {
    number: "4",
    title: "Legal Bases for Processing",
    body: [
      "Where applicable under relevant privacy laws, we process personal information only when we have a valid legal basis.",
    ],
    bullets: [
      "Your consent",
      "Performance of a contract or pre-contractual request",
      "Compliance with legal obligations",
      "Legitimate business interests, provided those interests do not override your rights and freedoms",
    ],
  },
  {
    number: "5",
    title: "How We Share Information",
    body: ["We do not sell, rent, or lease personal information."],
    groups: [
      {
        heading: "A. Service Providers",
        text: "We may share information with trusted vendors, contractors, and service providers who assist with website hosting, analytics, communications, customer support, marketing delivery, security, payment processing, CRM systems, or related operations. These parties may use personal information only as necessary to perform services for us and must keep it confidential.",
      },
      {
        heading: "B. Business and Service Fulfillment Partners",
        text: "If you request information, pricing, availability, installation, or service options related to telecommunications, connectivity, technology, or related offerings, we may share minimum necessary information with relevant carriers, providers, resellers, installers, or fulfillment partners strictly to respond to your request or deliver requested services.",
      },
      {
        heading: "C. Legal and Safety Reasons",
        text: "We may disclose information if required by law, subpoena, court order, governmental request, or other legal process, or when we believe in good faith disclosure is necessary to protect rights, property, safety, users, public, or to investigate fraud, security issues, unlawful activity, or enforce agreements and policies.",
      },
      {
        heading: "D. Business Transfers",
        text: "If we are involved in merger, acquisition, financing, reorganization, sale of assets, or similar corporate transaction, information may be transferred as part of that transaction, subject to appropriate confidentiality and legal safeguards.",
      },
    ],
  },
  {
    number: "6",
    title: "Cookies and Similar Technologies",
    body: [
      "We may use cookies, pixels, tags, scripts, and similar technologies to keep Site functioning properly, remember preferences, understand usage patterns, improve performance, measure marketing effectiveness, and enhance security.",
      "You may be able to control cookies through browser settings. Disabling cookies may affect certain Site functions. Where required by law, we will seek consent before using non-essential cookies or similar tracking technologies.",
    ],
  },
  {
    number: "7",
    title: "Marketing Communications",
    body: [
      "If you provide contact information, we may send information about products, services, updates, or offers relevant to your request or relationship with us, to extent permitted by law.",
      "You may opt out of promotional emails at any time using unsubscribe link in message or by contacting us directly. Even if you opt out, we may still send non-promotional communications related to inquiries, transactions, services, security, or account-related matters.",
    ],
  },
  {
    number: "8",
    title: "Data Retention",
    body: [
      "We retain personal information only for as long as reasonably necessary to fulfill collection purposes, provide requested services, maintain business and financial records, resolve disputes, enforce agreements, and meet legal, regulatory, tax, accounting, security, or compliance obligations.",
      "When personal information is no longer reasonably required, we will delete it, anonymize it, or securely store it in manner permitted by law.",
    ],
  },
  {
    number: "9",
    title: "Data Security",
    body: [
      "We use reasonable administrative, technical, and physical safeguards designed to protect personal information from unauthorized access, use, disclosure, alteration, or destruction.",
      "No internet transmission, email communication, or data storage system can be guaranteed 100% secure. While we strive to protect your information, we cannot guarantee absolute security.",
    ],
  },
  {
    number: "10",
    title: "Your Privacy Rights",
    body: [
      "Depending on your location and applicable law, you may have right to:",
    ],
    bullets: [
      "Request access to personal information we hold about you",
      "Request correction of inaccurate information",
      "Request deletion of your personal information",
      "Object to or restrict certain processing",
      "Withdraw consent where processing is based on consent",
      "Request portability of certain personal information",
      "Opt out of certain marketing communications",
    ],
    footer:
      "To exercise applicable privacy rights, contact us using details below. We may need to verify your identity before processing your request.",
  },
  {
    number: "11",
    title: "Do Not Track",
    body: [
      'Some web browsers may transmit "Do Not Track" signals. Because there is not yet a universally accepted standard for responding to those signals, our Site may not respond to them in all cases.',
    ],
  },
  {
    number: "12",
    title: "Third-Party Links and Services",
    body: [
      "Site may contain links to third-party websites, tools, or services. We are not responsible for privacy practices, content, or security of third-party services. Review privacy policies of any third-party sites you visit.",
    ],
  },
  {
    number: "13",
    title: "Children's Privacy",
    body: [
      "Site is not directed to children under age 13, and we do not knowingly collect personal information from children under 13. If you believe child has provided personal information to us, contact us so we can take appropriate steps to delete it.",
      "If applicable law in your jurisdiction sets higher age threshold for consent, we will comply with that requirement.",
    ],
  },
  {
    number: "14",
    title: "International Data Transfers",
    body: [
      "If you access Site from outside country where our servers or service providers are located, your information may be transferred to, stored in, and processed in different jurisdiction. By using Site and providing your information, you acknowledge those transfers may occur, subject to reasonable safeguards and applicable law.",
    ],
  },
  {
    number: "15",
    title: "Changes to This Privacy Policy",
    body: [
      'We reserve right to update or modify this Privacy Policy at any time. When we make changes, we will update "Last Updated" date at top of this page. If changes are material, we may also provide additional notice where appropriate.',
      "Your continued use of Site after changes become effective constitutes acceptance of updated Privacy Policy.",
    ],
  },
  {
    number: "16",
    title: "Contact Us",
    body: [
      "If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, contact us at:",
    ],
    contact: ["Telnova.ai", "(866) 335-0202"],
  },
];

function SectionBadge({ icon, children }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
      style={{
        backgroundColor: C.secondaryFixed,
        color: C.onSecondaryFixedVariant,
        ...BD,
      }}
    >
      <Icon name={icon} fill={1} size={14} />
      {children}
    </div>
  );
}

function PolicyCard({ item, index }) {
  return (
    <motion.article
      variants={stagger(index * 0.04)}
      className="rounded-3xl p-7 md:p-9"
      style={{
        backgroundColor: C.surfaceLowest,
        border: `1px solid ${C.outlineVariant}33`,
        ...SHADOW,
      }}
    >
      <div className="flex items-start gap-4 mb-5">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: C.primaryFixed }}
        >
          <span
            className="text-lg font-extrabold"
            style={{ color: C.primary, ...HL }}
          >
            {item.number}
          </span>
        </div>
        <div>
          <h2
            className="text-2xl md:text-3xl font-extrabold tracking-tight"
            style={{ color: C.primary, ...HL }}
          >
            {item.title}
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {item.body?.map((paragraph) => (
          <p
            key={paragraph}
            className="text-base md:text-lg leading-relaxed"
            style={{ color: C.onSurfaceVariant, ...BD }}
          >
            {paragraph}
          </p>
        ))}

        {item.bullets?.length ? (
          <ul className="grid gap-3 pt-1">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <Icon
                  name="check_circle"
                  fill={1}
                  size={18}
                  className="mt-1 shrink-0"
                  style={{ color: C.secondary }}
                />
                <span
                  className="text-base md:text-lg leading-relaxed"
                  style={{ color: C.onSurface, ...BD }}
                >
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {item.groups?.map((group) => (
          <div
            key={group.heading}
            className="rounded-2xl p-5 md:p-6"
            style={{ backgroundColor: C.surfaceLow }}
          >
            <h3
              className="text-lg md:text-xl font-bold mb-3"
              style={{ color: C.onSurface, ...HL }}
            >
              {group.heading}
            </h3>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: C.onSurfaceVariant, ...BD }}
            >
              {group.text}
            </p>
            {group.bullets?.length ? (
              <ul className="grid gap-3 pt-5">
                {group.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <Icon
                      name="radio_button_checked"
                      size={12}
                      className="mt-2 shrink-0"
                      style={{ color: C.secondary }}
                    />
                    <span
                      className="text-base md:text-lg leading-relaxed"
                      style={{ color: C.onSurface, ...BD }}
                    >
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

        {item.footer ? (
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: C.onSurfaceVariant, ...BD }}
          >
            {item.footer}
          </p>
        ) : null}

        {item.contact?.length ? (
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: C.primary, color: "#ffffff" }}
          >
            {item.contact.map((line) => (
              <p
                key={line}
                className="text-lg md:text-xl font-semibold leading-relaxed"
                style={{ ...BD }}
              >
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div style={{ ...BD, backgroundColor: C.surface, color: C.onSurface }}>
      <Navbar />

      <main className="pt-20">
        <section
          className="relative overflow-hidden py-28 md:py-36"
          style={{ backgroundColor: C.surface }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 65% 55% at 50% 0%, ${C.primaryFixed}66 0%, transparent 72%)`,
            }}
          />

          <div className="relative max-w-5xl mx-auto px-8 text-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div variants={stagger(0)}>
                <SectionBadge icon="policy">Privacy Policy</SectionBadge>
              </motion.div>

              <motion.h1
                variants={stagger(0.05)}
                className="mt-8 text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.95]"
                style={{ ...HL, color: C.primary }}
              >
                Privacy, handled with
                <br />
                <span style={{ color: C.secondary }}>stricter guardrails</span>
              </motion.h1>

              <motion.p
                variants={stagger(0.1)}
                className="mt-8 max-w-3xl mx-auto text-xl leading-relaxed"
                style={{ color: C.onSurfaceVariant, ...BD }}
              >
                This page explains how Telnova.ai collects, uses, stores,
                discloses, and protects information when you use our website,
                forms, tools, services, and communications.
              </motion.p>

              <motion.div
                variants={stagger(0.15)}
                className="mt-10 flex flex-wrap items-center justify-center gap-4"
              >
                <div
                  className="rounded-2xl px-5 py-4"
                  style={{ backgroundColor: C.surfaceLowest, ...SHADOW }}
                >
                  <p
                    className="text-sm uppercase tracking-[0.2em] font-bold"
                    style={{ color: C.primary, ...BD }}
                  >
                    Last Updated
                  </p>
                  <p
                    className="mt-1 text-lg font-semibold"
                    style={{ color: C.onSurface, ...BD }}
                  >
                    May 6, 2026
                  </p>
                </div>
                <a
                  href="tel:8663350202"
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl font-bold text-lg transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: C.primary,
                    color: "#ffffff",
                    ...BD,
                  }}
                >
                  <Icon name="call" fill={1} size={20} />
                  Call (866) 335-0202
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section
          className="py-16 md:py-20"
          style={{ backgroundColor: C.surfaceLow }}
        >
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              className="grid gap-6 md:grid-cols-3"
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            >
              {COMMITMENTS.map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="rounded-3xl p-7"
                  style={{
                    backgroundColor: C.surfaceLowest,
                    border: `1px solid ${C.outlineVariant}33`,
                    ...SHADOW,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      backgroundColor:
                        index === 1 ? C.secondaryFixed : C.primaryFixed,
                    }}
                  >
                    <Icon
                      name={item.icon}
                      fill={1}
                      size={22}
                      style={{
                        color:
                          index === 1
                            ? C.onSecondaryFixedVariant
                            : C.onPrimaryFixedVariant,
                      }}
                    />
                  </div>
                  <h2
                    className="text-2xl font-extrabold tracking-tight"
                    style={{ color: C.primary, ...HL }}
                  >
                    {item.title}
                  </h2>
                  <p
                    className="mt-3 text-base leading-relaxed"
                    style={{ color: C.onSurfaceVariant, ...BD }}
                  >
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section
          className="py-20 md:py-24"
          style={{ backgroundColor: C.surface }}
        >
          <div className="max-w-5xl mx-auto px-8">
            <motion.div
              className="space-y-8"
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            >
              {POLICY_SECTIONS.map((item, index) => (
                <PolicyCard key={item.number} item={item} index={index} />
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
