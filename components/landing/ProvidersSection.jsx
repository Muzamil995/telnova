"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { C, HL, BD, VIEWPORT, fadeUp } from "./tokens";
import Icon from "./Icon";

const PROVIDERS = [
  { name: "AT&T", src: "/providers/att2_logo_website-4-1.webp" },
  { name: "Brightspeed", src: "/providers/brightspeed-2048x662-1.webp" },
  { name: "DIRECTV", src: "/providers/directv_logo25.webp" },
  {
    name: "EarthLink",
    src: "/providers/Earthlink-authorized-retailer-logo-row.webp",
  },
  { name: "Frontier", src: "/providers/frontier_verizon-2048x765-1.webp" },
  { name: "Kinetic", src: "/providers/kinetic-logo-1.webp" },
  { name: "Optimum", src: "/providers/optimum_logo_website-1.webp" },
  { name: "Vivint", src: "/providers/vivint_logo.webp" },
  { name: "Provider", src: "/providers/image-1.png" },
];
const PROVIDERS_MARQUEE = [...PROVIDERS, ...PROVIDERS];

const TRUST_BADGES = [
  { icon: "verified", label: "Authorized retailer support" },
  { icon: "location_on", label: "Address-based availability checks" },
  { icon: "support_agent", label: "Phone help from real specialists" },
  { icon: "category", label: "Multiple service categories in one place" },
];

export default function ProvidersSection() {
  return (
    <section className="py-32" style={{ backgroundColor: C.surface }}>
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-5xl font-extrabold mb-6 tracking-tighter"
            style={{ ...HL, color: C.primary }}
          >
            Providers available near you
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-xl leading-relaxed"
            style={{ color: C.onSurfaceVariant, ...BD }}
          >
            Explore service options from leading providers and trusted partners
            based on your location and service needs.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <button
              className="px-10 py-4 rounded-lg font-bold text-lg transition-opacity hover:opacity-90"
              style={{
                backgroundColor: C.secondary,
                color: "#ffffff",
                boxShadow: "0 8px 24px rgba(0, 81, 213, 0.2)",
                ...BD,
              }}
            >
              Compare Providers
            </button>
          </motion.div>
        </motion.div>

        <div
          className="relative overflow-hidden rounded-2xl mb-20 p-4"
          style={{
            backgroundColor: C.surfaceLowest,
            border: `1px solid ${C.outlineVariant}`,
          }}
        >
          <motion.div
            className="flex w-max gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          >
            {PROVIDERS_MARQUEE.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="relative flex h-16 min-w-44 items-center justify-center overflow-hidden rounded-xl px-4"
                style={{
                  backgroundColor: C.surface,
                  border: `1px solid ${C.outlineVariant}`,
                }}
              >
                <Image
                  src={p.src}
                  alt={`${p.name} logo`}
                  fill
                  sizes="176px"
                  className="object-contain p-3"
                />
              </div>
            ))}
          </motion.div>
        </div>

        <div
          className="pt-10"
          style={{ borderTop: `1px solid ${C.outlineVariant}33` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRUST_BADGES.map(({ icon, label }, i) => (
              <motion.div
                key={label}
                className="flex items-center gap-3"
                style={{ color: C.onSurfaceVariant }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: i * 0.08,
                }}
              >
                <Icon
                  name={icon}
                  size={22}
                  style={{ color: C.secondary, opacity: 0.7 }}
                />
                <span className="text-sm font-semibold" style={{ ...BD }}>
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
