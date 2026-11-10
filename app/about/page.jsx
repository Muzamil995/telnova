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
  slideRight,
  slideLeft,
} from "@/components/landing/tokens";

// ─── Data ────────────────────────────────────────────────────────────

const HELP_WITH = [
  {
    icon: "compare_arrows",
    text: "Comparing available service categories in one place",
  },
  {
    icon: "location_on",
    text: "Checking address-based availability",
  },
  {
    icon: "category",
    text: "Explaining bundle options",
  },
  {
    icon: "install_desktop",
    text: "Helping customers understand installation and next steps",
  },
  {
    icon: "wifi",
    text: "Connecting households with internet, TV, mobile, and home security solutions",
  },
];

const WHY_CALL = [
  { icon: "home", text: "They are moving into a new home" },
  { icon: "swap_horiz", text: "They want to switch providers" },
  { icon: "workspaces", text: "They want to bundle services" },
  {
    icon: "help_outline",
    text: "They need help understanding what is available at their address",
  },
  {
    icon: "support_agent",
    text: "They prefer speaking with a real specialist",
  },
];

const PROMISE_PILLARS = [
  {
    icon: "chat_bubble_outline",
    label: "Clear Communication",
    desc: "Plain language, no jargon, no pressure.",
  },
  {
    icon: "lightbulb",
    label: "Helpful Guidance",
    desc: "We explain options — you decide what fits.",
  },
  {
    icon: "check_circle",
    label: "Practical Options",
    desc: "Real availability for your address and budget.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
      style={{
        backgroundColor: C.secondaryFixed,
        color: C.onSecondaryFixedVariant,
        ...BD,
      }}
    >
      {children}
    </div>
  );
}

function BulletItem({ icon, text, delay = 0 }) {
  return (
    <motion.div
      variants={stagger(delay)}
      className="flex items-start gap-4 p-5 rounded-2xl transition-shadow"
      style={{ backgroundColor: C.surfaceLowest, ...SHADOW }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: C.secondaryFixed }}
      >
        <Icon
          name={icon}
          size={20}
          style={{ color: C.onSecondaryFixedVariant }}
        />
      </div>
      <p
        className="text-base font-medium leading-relaxed"
        style={{ color: C.onSurface, ...BD }}
      >
        {text}
      </p>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div style={{ ...BD, backgroundColor: C.surface, color: C.onSurface }}>
      <Navbar />

      <main className="pt-20">
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section
          className="relative py-28 md:py-36 overflow-hidden"
          style={{ backgroundColor: C.surface }}
        >
          {/* Subtle bg gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${C.primaryFixed}55 0%, transparent 70%)`,
            }}
          />

          <div className="relative max-w-4xl mx-auto px-8 text-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div variants={stagger(0)}>
                <SectionLabel>
                  <Icon name="verified_user" fill={1} size={14} />
                  Authorized Retailer
                </SectionLabel>
              </motion.div>

              <motion.h1
                variants={stagger(0.05)}
                className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[0.95]"
                style={{ ...HL, color: C.primary }}
              >
                Helping households
                <br />
                <span style={{ color: C.secondary }}>connect smarter</span>
              </motion.h1>

              <motion.p
                variants={stagger(0.1)}
                className="text-xl leading-relaxed max-w-2xl mx-auto"
                style={{ color: C.onSurfaceVariant, ...BD }}
              >
                Telnova.ai makes it easier to explore home service options
                without jumping from provider to provider. We help customers
                compare available internet, TV, mobile, home phone, and home
                security services and get support choosing what fits their
                address, needs, and budget.
              </motion.p>

              <motion.div variants={stagger(0.15)} className="mt-12">
                <a
                  href="tel:8889890150"
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: C.primary,
                    color: "#ffffff",
                    ...BD,
                  }}
                >
                  <Icon name="call" fill={1} size={22} />
                  Call (888) 989-0150
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── WHO WE ARE ───────────────────────────────────────────── */}
        <section className="py-28" style={{ backgroundColor: C.surfaceLow }}>
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left copy */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                variants={{ show: { transition: { staggerChildren: 0.1 } } }}
              >
                <motion.div variants={fadeUp}>
                  <SectionLabel>
                    <Icon name="business" fill={1} size={14} />
                    Who We Are
                  </SectionLabel>
                </motion.div>

                <motion.h2
                  variants={fadeUp}
                  className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 leading-tight"
                  style={{ ...HL, color: C.primary }}
                >
                  Your partner for smarter service decisions
                </motion.h2>

                <motion.p
                  variants={fadeUp}
                  className="text-lg leading-relaxed"
                  style={{ color: C.onSurfaceVariant, ...BD }}
                >
                  Telnova.ai is an authorized retailer working with select
                  providers and service partners across the United States. Our
                  role is to make the shopping process simpler, more informed,
                  and more convenient for customers who want trusted service
                  options and real human support.
                </motion.p>
              </motion.div>

              {/* Right — Retailer badge card */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                variants={slideRight}
              >
                <div
                  className="rounded-3xl p-10 flex flex-col gap-6"
                  style={{ backgroundColor: C.surfaceLowest, ...SHADOW }}
                >
                  {/* Badge */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: C.secondaryFixed }}
                  >
                    <Icon
                      name="verified"
                      fill={1}
                      size={32}
                      style={{ color: C.secondary }}
                    />
                  </div>

                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: C.onSurfaceVariant, ...BD }}
                    >
                      Our relationship with providers
                    </p>
                    <h3
                      className="text-2xl font-extrabold mb-3"
                      style={{ ...HL, color: C.primary }}
                    >
                      Authorized Retailer
                      <br />
                      <span style={{ color: C.secondary }}>
                        — Not the Provider
                      </span>
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: C.onSurfaceVariant, ...BD }}
                    >
                      We are a licensed partner that helps customers find and
                      sign up for services. We do not own or operate any network
                      infrastructure. Service terms and availability come
                      directly from each provider.
                    </p>
                  </div>

                  {/* Trust row */}
                  <div
                    className="flex flex-wrap gap-3 pt-2"
                    style={{ borderTop: `1px solid ${C.outlineVariant}44` }}
                  >
                    {["Transparent", "Licensed", "Human Support"].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: C.surfaceLow,
                          color: C.onSurfaceVariant,
                          ...BD,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── WHAT WE HELP WITH ────────────────────────────────────── */}
        <section className="py-28" style={{ backgroundColor: C.surface }}>
          <div className="max-w-7xl mx-auto px-8">
            <motion.div
              className="max-w-2xl mb-16"
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div variants={fadeUp}>
                <SectionLabel>
                  <Icon name="handshake" fill={1} size={14} />
                  What We Help With
                </SectionLabel>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-4xl md:text-5xl font-extrabold tracking-tighter"
                style={{ ...HL, color: C.primary }}
              >
                Everything in one conversation
              </motion.h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            >
              {HELP_WITH.map(({ icon, text }, i) => (
                <BulletItem
                  key={text}
                  icon={icon}
                  text={text}
                  delay={i * 0.06}
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── WHY CUSTOMERS CALL US ────────────────────────────────── */}
        <section className="py-28" style={{ backgroundColor: C.surfaceLow }}>
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left — sticky heading block */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                className="lg:sticky lg:top-32"
              >
                <motion.div variants={fadeUp}>
                  <SectionLabel>
                    <Icon name="phone_in_talk" fill={1} size={14} />
                    Why Customers Call Us
                  </SectionLabel>
                </motion.div>
                <motion.h2
                  variants={fadeUp}
                  className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 leading-tight"
                  style={{ ...HL, color: C.primary }}
                >
                  Real reasons, real people
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="text-lg leading-relaxed"
                  style={{ color: C.onSurfaceVariant, ...BD }}
                >
                  Every call starts with a situation. We listen, ask the right
                  questions, and help find options that actually make sense.
                </motion.p>

                <motion.div variants={fadeUp} className="mt-10">
                  <a
                    href="tel:8889890150"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: C.secondary,
                      color: "#ffffff",
                      ...BD,
                    }}
                  >
                    <Icon name="call" fill={1} size={20} />
                    Call Now
                  </a>
                </motion.div>
              </motion.div>

              {/* Right — bullet list */}
              <motion.div
                className="flex flex-col gap-4"
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                variants={{ show: { transition: { staggerChildren: 0.1 } } }}
              >
                {WHY_CALL.map(({ icon, text }, i) => (
                  <BulletItem
                    key={text}
                    icon={icon}
                    text={text}
                    delay={i * 0.07}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── BRAND PROMISE ────────────────────────────────────────── */}
        <section className="py-28" style={{ backgroundColor: C.surfaceHigh }}>
          <div className="max-w-5xl mx-auto px-8">
            <motion.div
              className="text-center"
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            >
              <motion.div variants={fadeUp}>
                <SectionLabel>
                  <Icon name="favorite" fill={1} size={14} />
                  Brand Promise
                </SectionLabel>
              </motion.div>

              <motion.blockquote
                variants={fadeUp}
                className="text-3xl md:text-4xl font-extrabold tracking-tight leading-snug mb-12"
                style={{ ...HL, color: C.primary }}
              >
                "We want customers to feel{" "}
                <span style={{ color: C.secondary }}>
                  informed, not pressured
                </span>
                — and{" "}
                <span style={{ color: C.secondary }}>
                  confident, not confused
                </span>
                ."
              </motion.blockquote>

              {/* Three pillars */}
              <motion.div
                variants={fadeUp}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {PROMISE_PILLARS.map(({ icon, label, desc }) => (
                  <div
                    key={label}
                    className="p-8 rounded-2xl flex flex-col items-center text-center gap-4"
                    style={{ backgroundColor: C.surfaceLowest, ...SHADOW }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: C.secondaryFixed }}
                    >
                      <Icon
                        name={icon}
                        fill={1}
                        size={24}
                        style={{ color: C.secondary }}
                      />
                    </div>
                    <p
                      className="text-base font-extrabold"
                      style={{ ...HL, color: C.primary }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: C.onSurfaceVariant, ...BD }}
                    >
                      {desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="py-32" style={{ backgroundColor: C.primary }}>
          <motion.div
            className="max-w-3xl mx-auto px-8 text-center"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div variants={fadeUp} className="mb-6">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{
                  backgroundColor: `${C.secondaryFixed}22`,
                  color: C.secondaryFixedDim,
                  ...BD,
                }}
              >
                <Icon name="call" fill={1} size={14} />
                Talk to a specialist
              </div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight"
              style={{ ...HL, color: "#ffffff" }}
            >
              Ready to explore
              <br />
              your options?
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg mb-12"
              style={{ color: "rgba(255,255,255,0.65)", ...BD }}
            >
              Call Telnova.ai at{" "}
              <span style={{ color: C.secondaryFixedDim, fontWeight: 700 }}>
                (888) 989-0150
              </span>{" "}
              and let a specialist help you get started.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="tel:8889890150"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: C.secondary,
                  color: "#ffffff",
                  boxShadow: "0 8px 32px rgba(0,81,213,0.35)",
                  ...BD,
                }}
              >
                <Icon name="call" fill={1} size={22} />
                Call Now
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-xl font-bold text-lg transition-colors"
                style={{
                  border: `1px solid ${C.primaryFixedDim}55`,
                  color: C.primaryFixedDim,
                  ...BD,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = `${C.primaryFixed}11`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Explore Services
                <Icon name="arrow_forward" size={20} />
              </a>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-10 text-xs uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.3)", ...BD }}
            >
              No obligation. No credit card. Just helpful advice.
            </motion.p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
