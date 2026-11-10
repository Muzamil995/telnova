"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
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

// ─── Data ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "internet",
    icon: "wifi",
    label: "Internet Providers",
    providers: [
      {
        name: "AT&T",
        src: "/providers/att2_logo_website-4-1.webp",
        href: "/providers/att",
      },
      {
        name: "Frontier",
        src: "/providers/frontier_verizon-2048x765-1.webp",
        href: "/providers/frontier",
      },
      {
        name: "Brightspeed",
        src: "/providers/brightspeed-2048x662-1.webp",
        href: "/providers/brightspeed",
      },
      {
        name: "EarthLink",
        src: "/providers/Earthlink-authorized-retailer-logo-row.webp",
        href: "/providers/earthlink",
      },
      {
        name: "HughesNet",
        src: null,
        href: "/providers/hughesnet",
      },
      {
        name: "Optimum",
        src: "/providers/optimum_logo_website-1.webp",
        href: "/providers/optimum",
      },
      {
        name: "WOW!",
        src: null,
        href: "/providers/wow",
      },
      {
        name: "Kinetic",
        src: "/providers/kinetic-logo-1.webp",
        href: "/providers/kinetic",
      },
      {
        name: "Ziply",
        src: null,
        href: "/providers/ziply",
      },
      {
        name: "AltaFiber",
        src: null,
        href: "/providers/altafiber",
      },
    ],
  },
  {
    id: "tv",
    icon: "live_tv",
    label: "TV & Entertainment",
    providers: [
      {
        name: "DIRECTV",
        src: "/providers/directv_logo25.webp",
        href: "/providers/directv",
      },
    ],
  },
  {
    id: "mobile",
    icon: "ad_units",
    label: "Wireless & Mobile",
    providers: [
      {
        name: "T-Mobile",
        src: null,
        href: "/providers/tmobile",
      },
    ],
  },
  {
    id: "security",
    icon: "shield_with_heart",
    label: "Home Security",
    providers: [
      {
        name: "Vivint",
        src: "/providers/vivint_logo.webp",
        href: "/providers/vivint",
      },
    ],
  },
];

// ─── Sub-components ────────────────────────────────────────────────────

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

/** Logo tile — image if src, text fallback otherwise */
function ProviderTile({ name, src, href }) {
  return (
    <a
      href={href}
      className="group relative flex h-20 items-center justify-center rounded-2xl px-4 transition-all duration-200"
      style={{
        backgroundColor: C.surfaceLowest,
        border: `1px solid ${C.outlineVariant}55`,
        ...SHADOW,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${C.secondary}66`;
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(25,28,30,0.10)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${C.outlineVariant}55`;
        e.currentTarget.style.boxShadow = SHADOW.boxShadow;
      }}
      title={name}
    >
      {src ? (
        <Image
          src={src}
          alt={`${name} logo`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 176px"
          className="object-contain p-3 transition-opacity duration-200 group-hover:opacity-80"
        />
      ) : (
        <span
          className="text-sm font-extrabold tracking-tight transition-colors duration-200 group-hover:opacity-70"
          style={{ ...HL, color: C.onSurface }}
        >
          {name}
        </span>
      )}
    </a>
  );
}

function CategoryGroup({ category, query }) {
  const visible = category.providers.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  if (visible.length === 0) return null;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
    >
      {/* Category heading */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: C.secondaryFixed }}
        >
          <Icon name={category.icon} size={18} style={{ color: C.secondary }} />
        </div>
        <h3
          className="text-lg font-extrabold tracking-tight"
          style={{ ...HL, color: C.primary }}
        >
          {category.label}
        </h3>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: C.surfaceHigh,
            color: C.onSurfaceVariant,
            ...BD,
          }}
        >
          {visible.length}
        </span>
      </motion.div>

      {/* Logo grid */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-2"
      >
        {visible.map((p) => (
          <ProviderTile key={p.name} {...p} />
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────

export default function ProvidersPage() {
  const [query, setQuery] = useState("");

  const hasResults = useMemo(
    () =>
      CATEGORIES.some((cat) =>
        cat.providers.some((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        ),
      ),
    [query],
  );

  return (
    <div style={{ ...BD, backgroundColor: C.surface, color: C.onSurface }}>
      <Navbar />

      <main className="pt-20">
        {/* ── HERO ──────────────────────────────────────────────────── */}
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

          <div className="relative max-w-4xl mx-auto px-8 text-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div variants={stagger(0)}>
                <SectionLabel>
                  <Icon name="corporate_fare" fill={1} size={14} />
                  Provider Directory
                </SectionLabel>
              </motion.div>

              <motion.h1
                variants={stagger(0.05)}
                className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[0.95]"
                style={{ ...HL, color: C.primary }}
              >
                Compare providers and services{" "}
                <span style={{ color: C.secondary }}>in one place</span>
              </motion.h1>

              <motion.p
                variants={stagger(0.1)}
                className="text-xl leading-relaxed max-w-2xl mx-auto"
                style={{ color: C.onSurfaceVariant, ...BD }}
              >
                Telnova.ai helps customers explore services from trusted
                providers and partners based on location, category, and
                household needs.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ── SECTION INTRO ─────────────────────────────────────────── */}
        <section className="py-12" style={{ backgroundColor: C.surfaceLow }}>
          <div className="max-w-7xl mx-auto px-8">
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={fadeUp}
              className="text-base leading-relaxed max-w-3xl"
              style={{ color: C.onSurfaceVariant, ...BD }}
            >
              Availability, pricing, and service types can vary by address. Use
              this page to introduce provider categories, logo groups, and quick
              links to service or provider detail pages.
            </motion.p>
          </div>
        </section>

        {/* ── PROVIDER CATEGORIES ───────────────────────────────────── */}
        <section className="py-20" style={{ backgroundColor: C.surface }}>
          <div className="max-w-7xl mx-auto px-8">
            {/* Search + Compare CTA row */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
              className="flex flex-col sm:flex-row gap-4 mb-14"
            >
              <motion.div
                variants={fadeUp}
                className="relative flex-1 max-w-md"
              >
                <Icon
                  name="search"
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: C.onSurfaceVariant }}
                />
                <input
                  type="text"
                  placeholder="Search providers…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all"
                  style={{
                    backgroundColor: C.surfaceLowest,
                    border: `1px solid ${C.outlineVariant}`,
                    color: C.onSurface,
                    ...BD,
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = C.secondary)
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = C.outlineVariant)
                  }
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <button
                  className="whitespace-nowrap px-8 py-3.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: C.primary,
                    color: "#ffffff",
                    ...BD,
                  }}
                >
                  Compare Providers
                </button>
              </motion.div>
            </motion.div>

            {/* Category groups */}
            {hasResults ? (
              <div className="flex flex-col gap-16">
                {CATEGORIES.map((cat) => (
                  <CategoryGroup key={cat.id} category={cat} query={query} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <Icon
                  name="search_off"
                  size={40}
                  style={{ color: C.onSurfaceVariant, opacity: 0.4 }}
                />
                <p
                  className="mt-4 text-base font-semibold"
                  style={{ color: C.onSurfaceVariant, ...BD }}
                >
                  No providers match &ldquo;{query}&rdquo;
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* ── PAGE CTA ──────────────────────────────────────────────── */}
        <section className="py-32" style={{ backgroundColor: C.primary }}>
          <motion.div
            className="max-w-3xl mx-auto px-8 text-center"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight"
              style={{ ...HL, color: "#ffffff" }}
            >
              Not sure which provider is available at your address?
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-lg mb-12"
              style={{ color: "rgba(255,255,255,0.65)", ...BD }}
            >
              Call{" "}
              <a
                href="tel:8889890150"
                className="font-bold underline underline-offset-2 transition-opacity hover:opacity-80"
                style={{ color: C.secondaryFixedDim }}
              >
                (888) 989-0150
              </a>{" "}
              or check availability to see what options may be available near
              you.
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
                Call (888) 989-0150
              </a>

              <a
                href="/check-availability"
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
                Check availability
                <Icon name="arrow_forward" size={20} />
              </a>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
