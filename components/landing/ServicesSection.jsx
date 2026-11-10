"use client";

import { motion } from "framer-motion";
import { C, HL, BD, VIEWPORT, stagger, fadeUp } from "./tokens";
import Icon from "./Icon";

export default function ServicesSection() {
  return (
    <section className="py-24" style={{ backgroundColor: C.surfaceLow }}>
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-extrabold tracking-tight mb-4"
            style={{ ...HL, color: C.primary }}
          >
            Unified Connectivity
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-lg"
            style={{ color: C.onSurfaceVariant, ...BD }}
          >
            Integrated solutions designed to work in perfect harmony across your
            entire digital landscape.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Internet */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={stagger(0)}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="md:col-span-2 p-10 rounded-2xl cursor-default"
            style={{ backgroundColor: C.surfaceLowest }}
          >
            <Icon
              name="wifi"
              size={36}
              className="mb-6 block"
              style={{ color: C.secondary }}
            />
            <h3 className="text-2xl font-extrabold mb-3" style={{ ...HL }}>
              Internet
            </h3>
            <p
              className="leading-relaxed mb-6"
              style={{ color: C.onSurfaceVariant, ...BD }}
            >
              Fast and reliable plans for streaming, gaming, working from home,
              and everyday use.
            </p>
            <a
              href="#"
              className="font-bold inline-flex items-center gap-1 group transition-all"
              style={{ color: C.secondary, ...BD }}
            >
              Explore Speeds{" "}
              <Icon
                name="arrow_right_alt"
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </motion.div>

          {/* Mobile */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={stagger(0.08)}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="p-10 rounded-2xl cursor-default"
            style={{ backgroundColor: C.surfaceLowest }}
          >
            <Icon
              name="ad_units"
              size={36}
              className="mb-6 block"
              style={{ color: C.secondary }}
            />
            <h3 className="text-xl font-extrabold mb-3" style={{ ...HL }}>
              Infinite Mobile
            </h3>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: C.onSurfaceVariant, ...BD }}
            >
              Wireless options for individuals and families who want performance
              and value.
            </p>
            <a
              href="#"
              className="font-bold text-sm inline-flex items-center gap-1"
              style={{ color: C.secondary, ...BD }}
            >
              Learn More
            </a>
          </motion.div>

          {/* TV */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={stagger(0.16)}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="p-10 rounded-2xl cursor-default"
            style={{ backgroundColor: C.surfaceLowest }}
          >
            <Icon
              name="live_tv"
              size={36}
              className="mb-6 block"
              style={{ color: C.secondary }}
            />
            <h3 className="text-xl font-extrabold mb-3" style={{ ...HL }}>
              Smart TV
            </h3>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: C.onSurfaceVariant, ...BD }}
            >
              Entertainment options built around live channels, sports, movies,
              and streaming flexibility.
            </p>
            <a
              href="#"
              className="font-bold text-sm inline-flex items-center gap-1"
              style={{ color: C.secondary, ...BD }}
            >
              Learn More
            </a>
          </motion.div>

          {/* Security */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            className="md:col-span-4 p-12 rounded-2xl overflow-hidden relative group"
            style={{
              backgroundColor: C.primaryContainer,
              color: "#ffffff",
            }}
          >
            <div className="relative z-10 max-w-xl">
              <Icon
                name="shield_with_heart"
                size={36}
                className="mb-6 block"
                style={{ color: C.secondaryFixedDim }}
              />
              <h3
                className="text-3xl font-extrabold mb-4"
                style={{ ...HL, color: "#ffffff" }}
              >
                Home Security
              </h3>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ opacity: 0.8, ...BD }}
              >
                Connected protection with smart monitoring, cameras, and home
                automation features.
              </p>
              <button
                className="px-8 py-3 rounded-lg font-bold transition-colors"
                style={{
                  backgroundColor: "#ffffff",
                  color: C.primary,
                  ...BD,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = C.secondaryFixed)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ffffff")
                }
              >
                Configure System
              </button>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
              <img
                src="https://lh3.googleusercontent.com/aida/ADBb0ugZ5Tw6sYN8DiaO6B-2EJiF0JpGhLaPlAPTtEs0tdshSOr3DlOHlmaapO1v-vdusXMhhcYFZmg-spYhN5gyBKrFBc20a2oi7wj_7H5k1ucQA1uWSbgCMVnlLvXyGq1Ouowr41PiGunzoPsHIS3mNSCmz9RvmVTMSOfi0poUy4CJIeZgpVaSN-2hanrmFvhBG9219ElaUC0-sto0sejUKHsIgJfiHhOgth8VAd_O2-_RHbNkpfgqYK7zMvjWyAGGCdNFgfm6vKJp6Q"
                alt="Smart home security camera"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
