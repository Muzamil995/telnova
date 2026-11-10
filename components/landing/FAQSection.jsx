"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { C, HL, BD, VIEWPORT, fadeUp } from "./tokens";
import Icon from "./Icon";

const FAQS = [
  {
    q: "Why use Telnova.ai instead of shopping with one provider directly?",
    a: "Telnova.ai makes it easier to compare service options in one place and get help choosing a setup that works for your home.",
  },
  {
    q: "Does it cost anything to use Telnova.ai?",
    a: "You can explore options and speak with our team at no extra cost. Final service terms depend on the provider and your location.",
  },
  {
    q: "How fast can installation happen?",
    a: "Installation timing depends on the service selected, provider scheduling, and whether self-install or technician setup is available in your area.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: C.surfaceLowest }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full p-6 flex justify-between items-center text-left transition-colors"
        style={{ ...BD }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = C.surface)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
        aria-expanded={open}
      >
        <span
          className="text-lg font-bold pr-4"
          style={{ color: C.onSurface, ...BD }}
        >
          {q}
        </span>
        <Icon
          name={open ? "expand_less" : "expand_more"}
          className="shrink-0"
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "12rem" : 0 }}
      >
        <p
          className="px-6 pb-6 leading-relaxed"
          style={{ color: C.onSurfaceVariant, ...BD }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-24" style={{ backgroundColor: C.surfaceLow }}>
      <div className="max-w-4xl mx-auto px-8">
        <motion.h2
          className="text-4xl font-extrabold mb-12 text-center"
          style={{ ...HL, color: C.primary }}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={fadeUp}
        >
          Clarity in Connectivity
        </motion.h2>
        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {FAQS.map((item) => (
            <motion.div key={item.q} variants={fadeUp}>
              <FAQItem q={item.q} a={item.a} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
