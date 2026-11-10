"use client";

import { useState } from "react";
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

const FAQS = [
  {
    q: "What does Telnova.ai do?",
    a: "Telnova.ai helps customers compare available home service options such as internet, TV, mobile, home phone, and home security.",
  },
  {
    q: "Is Telnova.ai a provider?",
    a: "No. Telnova.ai is an authorized retailer for select providers and service partners.",
  },
  {
    q: "Does it cost anything to use Telnova.ai?",
    a: "Customers can explore options and speak with our team at no extra cost. Final service terms come from the provider or partner selected.",
  },
  {
    q: "Can I bundle more than one service?",
    a: "Yes. Depending on your address and provider availability, you may be able to bundle internet, TV, mobile, home phone, or home security services.",
  },
  {
    q: "How do I know what is available at my address?",
    a: "The best way is to call or submit your address and ZIP code so availability can be reviewed.",
  },
  {
    q: "How long does installation take?",
    a: "Installation timing varies by provider, service type, and whether technician setup or self-install is offered in your area.",
  },
  {
    q: "Are prices the same everywhere?",
    a: "No. Pricing, promotions, speeds, equipment, fees, and service options vary by provider and location.",
  },
  {
    q: "Can I talk to a person before choosing a service?",
    a: "Yes. Call (888) 989-0150 to speak with a Telnova.ai specialist.",
  },
];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={stagger(index * 0.05)}
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: C.surfaceLowest, ...SHADOW }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-7 py-6 flex justify-between items-center text-left transition-colors"
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = C.surfaceLow)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
        aria-expanded={open}
      >
        <span
          className="text-lg font-bold pr-6 leading-snug"
          style={{ color: C.onSurface, ...BD }}
        >
          {q}
        </span>
        <span
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{
            backgroundColor: open ? C.secondary : C.secondaryFixed,
            color: open ? "#ffffff" : C.onSecondaryFixedVariant,
          }}
        >
          <Icon name={open ? "remove" : "add"} size={18} />
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "20rem" : 0 }}
      >
        <p
          className="px-7 pb-7 text-base leading-relaxed"
          style={{ color: C.onSurfaceVariant, ...BD }}
        >
          {a}
        </p>
      </div>
    </motion.div>
  );
}

export default function FAQPage() {
  return (
    <div style={{ ...BD, backgroundColor: C.surface, color: C.onSurface }}>
      <Navbar />

      <main className="pt-20">
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section
          className="relative py-28 md:py-36 overflow-hidden"
          style={{ backgroundColor: C.surface }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${C.primaryFixed}55 0%, transparent 70%)`,
            }}
          />
          <div className="relative max-w-3xl mx-auto px-8 text-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div variants={stagger(0)}>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                  style={{
                    backgroundColor: C.secondaryFixed,
                    color: C.onSecondaryFixedVariant,
                    ...BD,
                  }}
                >
                  <Icon name="help" fill={1} size={14} />
                  Common Questions
                </div>
              </motion.div>

              <motion.h1
                variants={stagger(0.05)}
                className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[0.95]"
                style={{ ...HL, color: C.primary }}
              >
                Frequently asked{" "}
                <span style={{ color: C.secondary }}>questions</span>
              </motion.h1>

              <motion.p
                variants={stagger(0.1)}
                className="text-xl leading-relaxed max-w-2xl mx-auto"
                style={{ color: C.onSurfaceVariant, ...BD }}
              >
                Everything you need to know about how Telnova.ai works, what we
                offer, and how to get started.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ACCORDION ─────────────────────────────────────────── */}
        <section className="py-24" style={{ backgroundColor: C.surface }}>
          <div className="max-w-3xl mx-auto px-8">
            <motion.div
              className="flex flex-col gap-4"
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            >
              {FAQS.map((item, i) => (
                <FAQItem key={item.q} q={item.q} a={item.a} index={i} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA BLOCK ─────────────────────────────────────────────── */}
        <section className="py-32" style={{ backgroundColor: C.primary }}>
          <motion.div
            className="max-w-3xl mx-auto px-8 text-center"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div variants={fadeUp}>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
                style={{
                  backgroundColor: `${C.primaryFixed}22`,
                  color: C.primaryFixedDim,
                  ...BD,
                }}
              >
                <Icon name="headset_mic" fill={1} size={14} />
                Talk to a Specialist
              </div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight"
              style={{ ...HL, color: "#ffffff" }}
            >
              Still have questions?
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ color: C.primaryFixedDim, ...BD }}
            >
              Call our team and we will help you understand the options
              available for your address.
            </motion.p>

            <motion.div variants={fadeUp}>
              <a
                href="tel:8889890150"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
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
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
