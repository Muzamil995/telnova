"use client";

import { motion } from "framer-motion";
import { C, HL, BD, SHADOW, VIEWPORT, stagger, fadeUp } from "./tokens";

const BUNDLES = [
  {
    tier: "Essential",
    name: "Connected Bundle",
    price: "$49.99",
    desc: "Internet + Mobile. Best for everyday households that want reliable service, simple savings, and flexible connectivity.",
    featured: false,
  },
  {
    tier: "Performance",
    name: "Family Bundle",
    price: "$84.99",
    desc: "Internet + TV + Mobile + Home Phone. Built for families who stream, work, call, and stay connected across multiple devices.",
    featured: true,
  },
  {
    tier: "The Apex",
    name: "Complete Home Bundle",
    price: "$139.99",
    desc: "Internet + TV + Mobile + Home Phone + Home Security. Designed for connected homes that want convenience, entertainment, and extra peace of mind.",
    featured: false,
  },
];

export default function BundlesSection() {
  return (
    <section className="py-32" style={{ backgroundColor: C.surface }}>
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-5xl font-extrabold mb-6 tracking-tighter"
            style={{ ...HL }}
          >
            The Intelligence Tier
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-xl"
            style={{ color: C.onSurfaceVariant, ...BD }}
          >
            Select the bundle that mirrors your lifestyle.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {BUNDLES.map((bundle, i) =>
            bundle.featured ? (
              <motion.div
                key={bundle.name}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                variants={stagger(i * 0.1)}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="p-10 rounded-2xl flex flex-col lg:-translate-y-4 relative overflow-hidden"
                style={{
                  backgroundColor: C.primary,
                  color: "#ffffff",
                  ...SHADOW,
                }}
              >
                <div
                  className="absolute top-0 right-0 px-6 py-2 font-bold text-xs uppercase tracking-[0.2em]"
                  style={{
                    backgroundColor: C.secondary,
                    color: "#ffffff",
                    ...BD,
                  }}
                >
                  Recommended
                </div>
                <div className="mb-8">
                  <p
                    className="font-bold uppercase tracking-widest text-xs mb-2"
                    style={{ color: C.primaryFixedDim, ...BD }}
                  >
                    {bundle.tier}
                  </p>
                  <h3
                    className="text-3xl font-extrabold mb-4"
                    style={{ ...HL, color: "#ffffff" }}
                  >
                    {bundle.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-sm font-bold mr-2"
                      style={{ color: C.primaryFixedDim, ...BD }}
                    >
                      Starting from
                    </span>
                    <span
                      className="text-4xl font-black"
                      style={{ ...HL, color: "#ffffff" }}
                    >
                      {bundle.price}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: C.primaryFixedDim, ...BD }}
                    >
                      /mo*
                    </span>
                  </div>
                </div>
                <p
                  className="flex-1 mb-8"
                  style={{ color: C.primaryFixedDim, ...BD }}
                >
                  {bundle.desc}
                </p>
                <button
                  className="w-full py-4 rounded-lg font-bold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: C.secondary,
                    color: "#ffffff",
                    ...BD,
                  }}
                >
                  Get This Deal
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={bundle.name}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                variants={stagger(i * 0.1)}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="p-10 rounded-2xl flex flex-col"
                style={{ backgroundColor: C.surfaceLowest, ...SHADOW }}
              >
                <div className="mb-8">
                  <p
                    className="font-bold uppercase tracking-widest text-xs mb-2"
                    style={{ color: C.onSurfaceVariant, ...BD }}
                  >
                    {bundle.tier}
                  </p>
                  <h3
                    className="text-3xl font-extrabold mb-4"
                    style={{ ...HL }}
                  >
                    {bundle.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-sm font-bold mr-2"
                      style={{ color: C.onSurfaceVariant, ...BD }}
                    >
                      Starting from
                    </span>
                    <span className="text-4xl font-black" style={{ ...HL }}>
                      {bundle.price}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: C.onSurfaceVariant, ...BD }}
                    >
                      /mo*
                    </span>
                  </div>
                </div>
                <p
                  className="flex-1 mb-8"
                  style={{ color: C.onSurfaceVariant, ...BD }}
                >
                  {bundle.desc}
                </p>
                <button
                  className="w-full py-4 rounded-lg font-bold transition-all duration-200"
                  style={{ border: `1px solid ${C.outlineVariant}`, ...BD }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = C.primary;
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = C.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = C.onSurface;
                    e.currentTarget.style.borderColor = C.outlineVariant;
                  }}
                >
                  Get This Deal
                </button>
              </motion.div>
            ),
          )}
        </div>

        <p
          className="mt-12 text-center text-sm italic"
          style={{ color: C.onSurfaceVariant, ...BD }}
        >
          *Prices and availability may vary by location and provider. Terms and
          conditions apply.
        </p>
      </div>
    </section>
  );
}
