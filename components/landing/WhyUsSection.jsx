"use client";

import { motion } from "framer-motion";
import { C, HL, BD, SHADOW, VIEWPORT, fadeUp, slideRight } from "./tokens";
import Icon from "./Icon";

export default function WhyUsSection() {
  return (
    <section
      className="py-32 overflow-hidden"
      style={{ backgroundColor: C.surfaceHigh }}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            className="space-y-8"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest"
              style={{
                backgroundColor: C.secondary,
                color: "#ffffff",
                ...BD,
              }}
            >
              <Icon name="info" fill={1} size={18} />
              WHY TELNOVA.AI
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-5xl font-extrabold tracking-tighter leading-tight"
              style={{ ...HL, color: C.primary }}
            >
              Get more value from <br />
              your home services
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-xl leading-relaxed font-medium"
              style={{ color: C.onSurfaceVariant, ...BD }}
            >
              Shopping for home services should feel easier. Telnova.ai helps
              customers compare internet, TV, mobile, home phone, and home
              security options in one place. Whether someone is moving,
              switching, upgrading, or bundling, our team helps them understand
              the choices available and choose the solution that fits their
              household.
            </motion.p>

            <motion.div variants={fadeUp} className="pt-4">
              <button
                className="px-10 py-4 rounded-lg font-bold text-lg inline-flex items-center gap-2 transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: C.secondary,
                  color: "#ffffff",
                  ...BD,
                }}
              >
                Compare Services <Icon name="arrow_forward" />
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative group"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={slideRight}
          >
            <div
              className="absolute -inset-4 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundColor: `${C.secondary}1a` }}
            />
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                aspectRatio: "16/10",
                backgroundColor: C.surfaceLowest,
                ...SHADOW,
              }}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU8XVlh3qbfgCtg0YSivecxhTkkU1p5tA4i7zDd89zdwf_pQCk4S61rAF7TkSDJ4JhB81fNAEiJ9PFeqw8f-S61KEoVzhxXVVMdTy8p7Rm5LMpZZTOrSsHmFc1eEWCPIzuZ4ZxW-kh2HDZTVXBEP3l3E_lEFNCr8ewFNQAfkFMhE6X1Hy67LeE04tLlHBVC83hYyuf1p4DmOBcHP6O4T0pW8KRxu2L5aVO1plFg6yMZk_9hrpqrCaIt2gZFW52pD9QrOG2Nv0mA21R"
                alt="Modern home connectivity lifestyle"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div
              className="absolute -bottom-8 -right-8 p-6 rounded-2xl hidden md:block max-w-[200px]"
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0 8px 30px rgba(25,28,30,0.12)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: C.secondaryFixed }}
                >
                  <Icon
                    name="verified_user"
                    size={20}
                    style={{ color: C.onPrimaryFixedVariant }}
                  />
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ ...BD, color: C.onSurface }}
                >
                  Trusted Advisor
                </span>
              </div>
              <p
                className="text-xs"
                style={{ color: C.onSurfaceVariant, ...BD }}
              >
                Expert guidance for every home setup.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
