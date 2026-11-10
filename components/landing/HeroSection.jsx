"use client";

import { motion } from "framer-motion";
import { C, HL, BD, SHADOW, stagger, slideRight } from "./tokens";
import Icon from "./Icon";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[921px] flex items-center overflow-hidden"
      style={{ backgroundColor: C.surface }}
    >
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full relative z-10 py-24">
        {/* Left copy */}
        <motion.div
          className="lg:col-span-7 space-y-8"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div
            variants={stagger(0)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest"
            style={{
              backgroundColor: C.secondaryFixed,
              color: C.onSecondaryFixedVariant,
              ...BD,
            }}
          >
            <Icon name="bolt" fill={1} size={18} />
            Next-Gen Intelligence
          </motion.div>

          <motion.h1
            variants={stagger(0.05)}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter"
            style={{ ...HL, color: C.primary, lineHeight: 0.9 }}
          >
            Bundling for <br />
            <span style={{ color: C.secondary }}>Smarter</span> Living.
          </motion.h1>

          <motion.p
            variants={stagger(0.1)}
            className="text-xl max-w-xl leading-relaxed"
            style={{ color: C.onSurfaceVariant, ...BD }}
          >
            Internet, TV, mobile, and home security options in one place.
            Telnova.ai helps you compare available services for your address and
            find the setup that fits your home and budget.
          </motion.p>

          <motion.div
            variants={stagger(0.15)}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button
              className="px-8 py-4 rounded-lg font-bold text-lg transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: C.primary,
                color: "#ffffff",
                ...BD,
              }}
            >
              Check Availability
            </button>
            <button
              className="px-8 py-4 rounded-lg font-bold text-lg inline-flex items-center justify-center gap-2 transition-colors"
              style={{
                border: `1px solid ${C.outlineVariant}`,
                color: C.onSurface,
                backgroundColor: "transparent",
                ...BD,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = C.surfaceLow)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Call (888) 989-0150
            </button>
          </motion.div>

          <motion.p
            variants={stagger(0.2)}
            className="text-sm font-medium"
            style={{ color: C.onSurfaceVariant, ...BD }}
          >
            Real support. Clear options. Services from trusted providers and
            partners.
          </motion.p>
        </motion.div>

        {/* Right image */}
        <motion.div
          className="lg:col-span-5 relative hidden lg:block"
          initial="hidden"
          animate="show"
          variants={slideRight}
        >
          <div
            className="aspect-[4/5] rounded-2xl overflow-hidden"
            style={{ backgroundColor: C.surfaceHigh, ...SHADOW }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJL19zLkFhALYwgWqnYQ5nmQGpXfwNR8o8HvTXjwhRZob6U1y1u_lFFwtuKtzBr9wQYD_SlxWVZZvK14ZJuiMCznIhpZubOXLompVI3onrhCCKa8DTxtVDtbbJfIBD6QXd7THQCx_AOlKoQdV7vZlPaP7NDiL7Hhko3_WGzkz6IoGGNmS-pzSJrUeslwcqco7fEFZfNPf_4xJJOEshnzNuiKSWPQmxWm9a6BwjKVXO2mxvgMk9CN7pjDyb9YB8lmBUX0wry8umWQUo"
              alt="Modern minimalist home office"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div
            className="absolute -bottom-12 -left-12 p-8 rounded-2xl max-w-[280px]"
            style={{ backgroundColor: C.surfaceLowest, ...SHADOW }}
          >
            <p
              className="text-3xl font-extrabold"
              style={{ ...HL, color: C.primary }}
            >
              2.5 Gbps
            </p>
            <p
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: C.onSurfaceVariant, ...BD }}
            >
              Unmatched Speed
            </p>
          </div>
        </motion.div>
      </div>

      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{
          background: `linear-gradient(to left, ${C.primaryFixed}33, transparent)`,
        }}
      />
    </section>
  );
}
