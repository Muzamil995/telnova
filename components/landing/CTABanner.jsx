"use client";

import { motion } from "framer-motion";
import { C, HL, BD, VIEWPORT, fadeUp } from "./tokens";

export default function CTABanner() {
  return (
    <section
      className="py-32"
      style={{ backgroundColor: C.primary, color: "#ffffff" }}
    >
      <motion.div
        className="max-w-4xl mx-auto px-8 text-center"
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.h2
          variants={fadeUp}
          className="text-5xl font-black tracking-tighter mb-8 leading-tight"
          style={{ ...HL }}
        >
          Talk to a Telnova.ai specialist today
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-xl mb-12"
          style={{ color: "rgba(255,255,255,0.7)", ...BD }}
        >
          Call now to compare internet, TV, mobile, and home service options for
          your address.
        </motion.p>
        <motion.div variants={fadeUp}>
          <button
            className="px-10 py-4 rounded-lg font-bold text-lg transition-opacity hover:opacity-90"
            style={{
              backgroundColor: C.secondary,
              color: "#ffffff",
              boxShadow: "0 8px 24px rgba(0, 81, 213, 0.3)",
              ...BD,
            }}
          >
            Call (888) 989-0150
          </button>
        </motion.div>
        <motion.p
          variants={fadeUp}
          className="mt-8 text-xs uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.4)", ...BD }}
        >
          No credit card required. Private &amp; Encrypted.
        </motion.p>
      </motion.div>
    </section>
  );
}
