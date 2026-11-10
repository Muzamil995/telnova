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

const HIGHLIGHTS = [
  {
    icon: "gavel",
    title: "Use Boundaries",
    text: "Site may be used only for lawful, legitimate personal or business inquiry purposes under these Terms.",
  },
  {
    icon: "mark_email_read",
    title: "Communication Consent",
    text: "Submitting information can trigger service and, where opted in, marketing communications permitted by law.",
  },
  {
    icon: "rule",
    title: "Provider Limits",
    text: "Quotes, pricing, availability, installation timing, and provider approvals can change and are not guaranteed.",
  },
];

const TERMS_SECTIONS = [
  {
    number: "0",
    title: "Scope and Acceptance",
    body: [
      'These Terms & Conditions govern your access to and use of website located at telnova.ai, including all related pages, content, forms, tools, communications, and services made available through site, collectively called "Site," operated by Telnova.ai.',
      "By accessing, browsing, submitting information to, or using Site, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not use Site.",
    ],
  },
  {
    number: "1",
    title: "Agreement to the Terms",
    body: [
      'These Terms constitute legally binding agreement between you and Telnova.ai. If you are using Site on behalf of company, organization, or other entity, you represent and warrant that you have authority to bind that entity to these Terms, and "you" includes that entity.',
      'We may update these Terms from time to time. When we do, we will revise "Last Updated" date above. Your continued use of Site after updated Terms are posted constitutes acceptance of revised Terms.',
    ],
  },
  {
    number: "2",
    title: "Eligibility",
    body: ["You may use Site only if:"],
    bullets: [
      "You are at least 18 years old",
      "You have legal capacity to enter into binding agreement",
      "Your use of Site does not violate any applicable law, regulation, or contractual obligation",
    ],
    footer:
      "Site is not intended for minors. Individuals under 18 are prohibited from using or registering on Site.",
  },
  {
    number: "3",
    title: "Geographic Use",
    body: [
      "Site is controlled and operated from United States. We make no representation that Site or its content is appropriate or available in all locations. If you access Site from outside United States, you do so at your own initiative and are solely responsible for compliance with local laws.",
    ],
  },
  {
    number: "4",
    title: "Services and Informational Nature of the Site",
    body: [
      "Telnova.ai may provide information, estimates, quotes, recommendations, lead forms, consultations, product comparisons, scheduling tools, and related telecommunications or technology-related service information through Site.",
      "All information on Site is provided for general informational and commercial purposes only. Availability, pricing, serviceability, eligibility, promotions, installation timelines, and provider-specific terms are subject to change without notice and may depend on address qualification, provider approval, credit review, equipment availability, and other factors outside our control.",
      "Nothing on Site constitutes guarantee of service availability, installation, pricing, savings, coverage, speed, performance, or provider acceptance.",
    ],
  },
  {
    number: "5",
    title: "No Professional, Legal, Financial, or Regulatory Advice",
    body: [
      "Site and its content do not constitute legal, tax, accounting, financial, regulatory, or other professional advice. You are responsible for obtaining independent advice where appropriate.",
    ],
  },
  {
    number: "6",
    title: "Privacy Policy",
    body: [
      "Your use of Site is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using Site, you acknowledge that you have reviewed and understood our Privacy Policy.",
    ],
  },
  {
    number: "7",
    title: "Consent to Communications",
    body: [
      "By submitting your contact information through Site, you expressly consent to receive communications from us, including by phone call, email, SMS, MMS, and prerecorded or automated technology, to extent permitted by applicable law.",
    ],
    groups: [
      {
        heading: "A. Service Communications",
        text: "If you provide your contact information in connection with quote request, appointment, support inquiry, installation, order, or other service-related interaction, you consent to receive non-marketing communications relating to that request or service, including:",
        bullets: [
          "Quote follow-ups",
          "Appointment confirmations",
          "Installation updates",
          "Order-related notices",
          "Billing notices",
          "Support communications",
          "Account or service notifications",
        ],
      },
      {
        heading: "B. Marketing Communications",
        text: "Where you separately opt in, you agree that we may send promotional or marketing messages, including offers, updates, service promotions, and partner-related opportunities. Consent to marketing communications is not condition of purchase. Message and data rates may apply. Message frequency may vary.",
      },
      {
        heading: "C. Opt-Out",
        text: "You may revoke marketing consent at any time by:",
        bullets: [
          "Replying STOP to SMS messages",
          "Using unsubscribe link in email messages",
          "Contacting us at [Privacy Email]",
        ],
      },
    ],
    footer:
      "We may still send transactional or service-related communications as permitted by law.",
  },
  {
    number: "8",
    title: "Record of Consent",
    body: [
      "You agree that electronic records, webform submissions, timestamped checkboxes, call records, message records, and related system logs may be used by us to document and prove your consent, requests, opt-ins, and opt-outs.",
    ],
  },
  {
    number: "9",
    title: "Account and Submitted Information",
    body: [
      "If Site allows account creation, quote submission, service requests, or other submissions, you agree to provide accurate, current, complete, and lawful information.",
      "You may not:",
    ],
    bullets: [
      "Impersonate any person or entity",
      "Submit false, misleading, or fraudulent information",
      "Use information belonging to another person without authorization",
      "Create multiple accounts for abusive or deceptive purposes",
      "Attempt to bypass verification or security measures",
    ],
    footer:
      "We reserve right to suspend, reject, or terminate access if submitted information is inaccurate, incomplete, unauthorized, deceptive, or unlawful.",
  },
  {
    number: "10",
    title: "Permitted Use",
    body: [
      "You may use Site only for lawful purposes and only in accordance with these Terms. You may use Site for your own internal, personal, or legitimate business inquiry purposes only.",
      "You may not use Site in way that:",
    ],
    bullets: [
      "Violates any law or regulation",
      "Infringes another party's rights",
      "Interferes with operation or security of Site",
      "Harms us, our partners, providers, systems, users, or reputation",
    ],
  },
  {
    number: "11",
    title: "Prohibited Conduct",
    body: ["You agree not to, and not to assist or permit others to:"],
    bullets: [
      "Copy, reproduce, republish, upload, post, transmit, or distribute Site content except as expressly allowed",
      "Scrape, crawl, spider, harvest, or extract Site data using any bot, script, robot, AI agent, or automated means",
      "Bypass or attempt to bypass access controls, rate limits, security features, or authentication systems",
      "Frame, mirror, or otherwise display Site on another website or service without written permission",
      "Use Site to compete with us or build competing product, dataset, directory, or lead database",
      "Submit viruses, malware, harmful code, or disruptive content",
      "Probe, scan, or test vulnerability of Site or related systems",
      "Overload, flood, or impair Site performance",
      "Use false headers, forged identities, spoofing techniques, or misleading metadata",
      "Collect personal information about other users without authorization",
      "Upload unlawful, defamatory, obscene, threatening, harassing, deceptive, or infringing material",
      "Reverse engineer, decompile, disassemble, or otherwise attempt to derive source code from any non-open part of Site",
      "Use Site for unauthorized commercial solicitation, spam, or lead resale",
    ],
  },
  {
    number: "12",
    title: "Intellectual Property Rights",
    body: [
      "Site and all content, materials, designs, text, graphics, logos, icons, interfaces, software, code, audio, video, arrangements, and trademarks displayed on or through Site are owned by or licensed to Telnova.ai and are protected by copyright, trademark, trade dress, trade secret, and other intellectual property laws.",
      "Except as expressly stated in these Terms, no right, title, or interest in Site or Content is transferred to you.",
      "You may not copy, modify, distribute, sell, license, create derivative works from, publicly display, publicly perform, republish, or exploit any Content without our prior written consent. All rights not expressly granted are reserved.",
    ],
  },
  {
    number: "13",
    title: "User Submissions",
    body: [
      'If you submit reviews, feedback, suggestions, ideas, inquiries, text, images, recordings, or other materials to us through Site ("Submissions"), you represent and warrant that:',
    ],
    bullets: [
      "You own or control rights necessary to provide Submission",
      "Submission is accurate to your knowledge",
      "Submission does not violate law or infringe any third-party rights",
      "Submission does not contain unlawful, malicious, deceptive, or harmful material",
    ],
    footer:
      "By submitting Submission, you grant us worldwide, non-exclusive, royalty-free, sublicensable right to use, host, store, reproduce, modify, adapt, display, publish, and distribute Submission for purpose of operating, improving, marketing, documenting, or providing Site and our services, subject to our Privacy Policy where applicable. You remain responsible for your Submissions. We are not obligated to keep any Submission confidential unless required by law or expressly agreed in writing.",
  },
  {
    number: "14",
    title: "Third-Party Providers, Websites, and Content",
    body: [
      "Site may reference or link to third-party providers, carriers, vendors, websites, software, services, or content. We do not own or control all such third parties, and we do not guarantee their accuracy, availability, legality, security, or performance.",
      "Any dealings between you and third party are solely between you and that third party unless we expressly state otherwise.",
      "Third-party services, products, offers, installation services, financing, warranties, speeds, availability, and service terms are subject to third party's own terms and conditions.",
    ],
  },
  {
    number: "15",
    title: "Orders, Quotes, Availability, and Provider Terms",
    body: [
      "Any quote, estimate, pricing example, service comparison, or offer shown on Site is informational only unless and until confirmed by applicable provider or by us in writing.",
      "We reserve right to refuse, cancel, or limit any request, quote, order, or service inquiry at any time for reasons including:",
    ],
    bullets: [
      "Incorrect pricing or content",
      "Service unavailability",
      "Address ineligibility",
      "Suspected fraud",
      "Legal or compliance concerns",
      "Provider rejection",
      "Verification failure",
      "System or data errors",
    ],
    footer:
      "Provider-specific terms, installation requirements, credit checks, equipment requirements, cancellation policies, fees, taxes, and service limitations may apply separately.",
  },
  {
    number: "16",
    title: "Site Availability and Changes",
    body: [
      "We do not guarantee that Site will be available at all times or free from interruption, delay, error, or defect.",
      "We may, at any time and without notice:",
    ],
    bullets: [
      "Modify or discontinue any part of Site",
      "Change features, content, pricing displays, or functionality",
      "Suspend access for maintenance, security, compliance, or operational reasons",
      "Impose limits on access or use",
    ],
    footer:
      "We are not liable for any loss, damage, or inconvenience caused by downtime, interruption, suspension, or discontinuation.",
  },
  {
    number: "17",
    title: "Security",
    body: [
      "You are responsible for maintaining confidentiality of your credentials, devices, and account access, if applicable. You must notify us immediately of any unauthorized use or security incident involving your interaction with Site.",
      "We reserve right to investigate actual or suspected misuse and to take any action we deem appropriate, including suspension, termination, blocking IPs, preserving records, and cooperating with law enforcement.",
    ],
  },
  {
    number: "18",
    title: "Disclaimer of Warranties",
    body: [
      'SITE AND ALL CONTENT, FUNCTIONS, MATERIALS, COMMUNICATIONS, AND SERVICES MADE AVAILABLE THROUGH SITE ARE PROVIDED ON AN "AS IS," "AS AVAILABLE," AND "WITH ALL FAULTS" BASIS.',
      "TO MAXIMUM EXTENT PERMITTED BY LAW, TELNOVA.AI DISCLAIMS ALL WARRANTIES, EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING ANY WARRANTIES OF:",
    ],
    bullets: [
      "MERCHANTABILITY",
      "FITNESS FOR PARTICULAR PURPOSE",
      "TITLE",
      "NON-INFRINGEMENT",
      "ACCURACY",
      "COMPLETENESS",
      "RELIABILITY",
      "QUIET ENJOYMENT",
      "SECURITY",
      "AVAILABILITY",
      "RESULTS FROM USE",
    ],
    footer:
      "WE DO NOT WARRANT THAT SITE WILL BE ERROR-FREE, SECURE, UNINTERRUPTED, FREE OF HARMFUL CODE, OR THAT DEFECTS WILL BE CORRECTED.",
  },
  {
    number: "19",
    title: "Limitation of Liability",
    body: [
      "TO FULLEST EXTENT PERMITTED BY LAW, TELNOVA.AI AND ITS OFFICERS, DIRECTORS, OWNERS, EMPLOYEES, CONTRACTORS, AGENTS, AFFILIATES, LICENSORS, AND SERVICE PROVIDERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, BUSINESS, DATA, GOODWILL, OR OPPORTUNITY, ARISING OUT OF OR RELATED TO:",
    ],
    bullets: [
      "Your use of or inability to use Site",
      "Any content or information on Site",
      "Any third-party content, provider, product, or service",
      "Any interruption, error, or security issue",
      "Any unauthorized access to or use of data",
      "Any virus, malware, or harmful component",
    ],
    footer:
      "TO MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL AGGREGATE LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO SITE OR THESE TERMS SHALL NOT EXCEED GREATER OF AMOUNT YOU PAID TO US, IF ANY, IN SIX (6) MONTHS PRECEDING EVENT GIVING RISE TO CLAIM, OR ONE HUNDRED U.S. DOLLARS (US $100). SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS, SO PARTS OF THIS SECTION MAY NOT APPLY TO YOU.",
  },
  {
    number: "20",
    title: "Indemnification",
    body: [
      "You agree to defend, indemnify, and hold harmless Telnova.ai and its affiliates, officers, directors, employees, contractors, agents, licensors, and partners from and against any claims, liabilities, damages, judgments, awards, losses, costs, and expenses, including reasonable attorneys' fees, arising out of or relating to:",
    ],
    bullets: [
      "Your use or misuse of Site",
      "Your breach of these Terms",
      "Your violation of any law or regulation",
      "Your infringement of any third-party right",
      "Your Submissions or communications",
      "Your fraud, negligence, willful misconduct, or unauthorized activities",
    ],
  },
  {
    number: "21",
    title: "Suspension and Termination",
    body: [
      "We may suspend, restrict, or terminate your access to Site, with or without notice, at any time and for any reason, including if we believe you violated these Terms, applicable law, or created risk for us, our users, providers, or systems.",
      "Termination does not limit any of our other rights or remedies.",
    ],
  },
  {
    number: "22",
    title: "Dispute Resolution; Arbitration; Class Action Waiver",
    groups: [
      {
        heading: "A. Informal Resolution First",
        text: "Before filing any claim, you agree to attempt to resolve dispute informally by contacting us at [Support Email] and providing written description of issue. Both parties agree to attempt good-faith resolution for at least 30 days.",
      },
      {
        heading: "B. Binding Arbitration",
        text: "Except for disputes eligible for small claims court or claims seeking injunctive relief for misuse of intellectual property, confidentiality, unauthorized access, fraud, or similar urgent matters, any dispute arising out of or relating to these Terms or Site shall be resolved by final and binding arbitration. Arbitration shall be administered by American Arbitration Association (AAA) under its applicable rules, unless applicable law requires otherwise.",
      },
      {
        heading: "C. No Class Actions",
        text: "TO MAXIMUM EXTENT PERMITTED BY LAW, YOU AND TELNOVA.AI AGREE THAT EACH MAY BRING CLAIMS AGAINST OTHER ONLY IN INDIVIDUAL CAPACITY AND NOT AS PLAINTIFF, CLASS MEMBER, PRIVATE ATTORNEY GENERAL, OR PARTICIPANT IN ANY CLASS, COLLECTIVE, CONSOLIDATED, OR REPRESENTATIVE ACTION.",
      },
      {
        heading: "D. Venue for Non-Arbitrable Matters",
        text: "If dispute is found not subject to arbitration, then dispute shall be brought exclusively in state or federal courts located in [State, County], and each party consents to personal jurisdiction and venue there.",
      },
    ],
  },
  {
    number: "23",
    title: "Governing Law",
    body: [
      "These Terms and any dispute arising out of or relating to them or Site shall be governed by laws of State of [State], without regard to conflict of law principles.",
    ],
  },
  {
    number: "24",
    title: "Compliance Restrictions",
    body: [
      "Site is not intended for use in connection with information or activities requiring compliance with specialized regulatory frameworks unless we expressly agree otherwise in writing. Unless expressly stated by us, you may not use Site in connection with regulated data or regulated activities requiring compliance under laws such as:",
    ],
    bullets: [
      "HIPAA",
      "GLBA",
      "FISMA",
      "Similar industry-specific or government-specific regulations",
    ],
  },
  {
    number: "25",
    title: "Electronic Communications and Signatures",
    body: [
      "By using Site, sending us emails, submitting forms, checking consent boxes, or otherwise interacting electronically with us, you consent to receive communications electronically.",
      "You agree that electronic signatures, notices, records, disclosures, and agreements satisfy any legal requirement that such communications be in writing.",
    ],
  },
  {
    number: "26",
    title: "Feedback",
    body: [
      "If you provide suggestions, ideas, comments, or feedback about Site or our services, you grant us unrestricted right to use that feedback without compensation, acknowledgment, or obligation to you, provided that any personal information is handled in accordance with our Privacy Policy.",
    ],
  },
  {
    number: "27",
    title: "Severability",
    body: [
      "If any provision of these Terms is found unlawful, void, or unenforceable, that provision shall be deemed severable and remaining provisions shall remain in full force and effect.",
    ],
  },
  {
    number: "28",
    title: "No Waiver",
    body: [
      "Our failure to enforce any provision of these Terms shall not constitute waiver of that provision or any other right.",
    ],
  },
  {
    number: "29",
    title: "Assignment",
    body: [
      "We may assign or transfer our rights and obligations under these Terms at any time, in whole or in part, without notice. You may not assign your rights or obligations under these Terms without our prior written consent.",
    ],
  },
  {
    number: "30",
    title: "Entire Agreement",
    body: [
      "These Terms, together with our Privacy Policy and any other policies or legal notices posted on Site, constitute entire agreement between you and Telnova.ai regarding Site and supersede any prior or contemporaneous understandings relating to same subject matter.",
    ],
  },
  {
    number: "31",
    title: "Contact Information",
    body: [
      "If you have questions about these Terms or wish to contact us regarding Site, please contact:",
    ],
    contact: ["Telnova.ai", "Phone: (866) 335-0202"],
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

function TermsCard({ item, index }) {
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
        <h2
          className="text-2xl md:text-3xl font-extrabold tracking-tight"
          style={{ color: C.primary, ...HL }}
        >
          {item.title}
        </h2>
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

export default function TermsOfServicePage() {
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
                <SectionBadge icon="gavel">Terms & Conditions</SectionBadge>
              </motion.div>

              <motion.h1
                variants={stagger(0.05)}
                className="mt-8 text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.95]"
                style={{ ...HL, color: C.primary }}
              >
                Rules for using
                <br />
                <span style={{ color: C.secondary }}>Telnova.ai</span>
              </motion.h1>

              <motion.p
                variants={stagger(0.1)}
                className="mt-8 max-w-3xl mx-auto text-xl leading-relaxed"
                style={{ color: C.onSurfaceVariant, ...BD }}
              >
                These Terms explain who can use Site, how communications,
                quotes, content, orders, and disputes are handled, and what
                limits apply when you use Telnova.ai.
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
              {HIGHLIGHTS.map((item, index) => (
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
              {TERMS_SECTIONS.map((item, index) => (
                <TermsCard key={item.number} item={item} index={index} />
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
