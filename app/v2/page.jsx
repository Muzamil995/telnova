"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";

// ─── Animation variants ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const VIEWPORT = { once: true, margin: "-80px" };

// ─── Design tokens (hex) ─────────────────────────────────────────────
const C = {
  primary: "#000000",
  secondary: "var(--brand-violet)",
  surface: "#f7f9fb",
  surfaceLow: "#f2f4f6",
  surfaceLowest: "#ffffff",
  surfaceHigh: "#e6e8ea",
  primaryContainer: "#111c2d",
  secondaryFixed: "#dbe1ff",
  secondaryFixedDim: "#b4c5ff",
  primaryFixed: "#d8e3fb",
  primaryFixedDim: "#bcc7de",
  onSurface: "#191c1e",
  onSurfaceVariant: "#45464d",
  onPrimaryFixed: "#111c2d",
  onPrimaryFixedVariant: "#3c475a",
  onSecondaryFixedVariant: "#003ea8",
  outlineVariant: "#c6c6cd",
};

// ─── Font helpers ─────────────────────────────────────────────────────
const HL = {
  fontFamily: "var(--font-headline, 'Plus Jakarta Sans', sans-serif)",
};
const BD = { fontFamily: "var(--font-body, 'Manrope', sans-serif)" };
const SHADOW = { boxShadow: "0 20px 40px rgba(25, 28, 30, 0.04)" };

// ─── Icon component ───────────────────────────────────────────────────
function Icon({ name, fill = 0, size = 24, className = "" }) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
        fontSize: size,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {name}
    </span>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "About Us" },
  {
    label: "Providers",
    dropdown: [
      { label: "AT&T" },
      { label: "BRIGHTSPEED" },
      { label: "DIRECTV" },
      { label: "EARTHLINK" },
      { label: "FRONTIER" },
      { label: "Browse All", isAction: true },
    ],
  },
  { label: "Solutions" },
  { label: "Blog" },
  { label: "FAQ" },
];

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

// ─── Providers Dropdown ───────────────────────────────────────────────
function ProvidersDropdown({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-bold tracking-tight transition-all duration-300 inline-flex items-center gap-1 pb-[4px]"
        style={{
          ...HL,
          color: C.onSurface,
          opacity: 0.8,
          borderBottom: "2px solid transparent",
          background: "none",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = C.secondary;
          e.currentTarget.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = C.onSurface;
          e.currentTarget.style.opacity = "0.8";
        }}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Providers
        <Icon
          name="expand_more"
          size={18}
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 rounded-xl overflow-hidden z-50"
            style={{
              backgroundColor: C.surfaceLowest,
              boxShadow: "0 8px 30px rgba(25,28,30,0.12)",
              border: `1px solid ${C.outlineVariant}33`,
            }}
          >
            {items.map(({ label, isAction }) => (
              <a
                key={label}
                href="#"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-5 py-3 text-sm font-semibold transition-colors"
                style={{
                  color: isAction ? C.secondary : C.onSurface,
                  fontWeight: isAction ? 700 : 600,
                  borderTop: isAction
                    ? `1px solid ${C.outlineVariant}55`
                    : "none",
                  ...BD,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = C.surfaceLow)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {label}
                {isAction && (
                  <Icon
                    name="arrow_right_alt"
                    size={18}
                    style={{ color: C.secondary }}
                  />
                )}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────
function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 w-full z-50 backdrop-blur-xl"
      style={{ backgroundColor: `${C.surface}cc` }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Telnova logo"
            width={100}
            height={100}
            priority
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, dropdown }) =>
            dropdown ? (
              <ProvidersDropdown key={label} items={dropdown} />
            ) : (
              <a
                key={label}
                href="#"
                className="font-bold tracking-tight transition-all duration-300 pb-[4px]"
                style={{
                  ...HL,
                  color: C.onSurface,
                  opacity: 0.8,
                  borderBottom: "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.secondary;
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.onSurface;
                  e.currentTarget.style.opacity = "0.8";
                }}
              >
                {label}
              </a>
            ),
          )}
        </div>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            className="font-bold px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              color: C.onSurface,
              border: `1px solid ${C.outlineVariant}`,
              ...BD,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = C.surfaceLow)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Sign In
          </button>
          <button
            className="px-5 py-2.5 rounded-lg font-bold transition-transform duration-200 hover:scale-105 whitespace-nowrap"
            style={{ backgroundColor: C.primary, color: "#ffffff", ...BD }}
          >
            Call (888) 989-0150
          </button>
        </div>

        {/* Mobile hamburger → Sheet */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: C.onSurface }}
                aria-label="Open menu"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = C.surfaceLow)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Icon name="menu" size={28} />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-80 p-0 flex flex-col"
              style={{ backgroundColor: C.surfaceLowest }}
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              {/* Sheet header */}
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: `1px solid ${C.outlineVariant}33` }}
              >
                <a href="/" className="flex items-center">
                  <Image
                    src="/logo.svg"
                    alt="Telnova logo"
                    width={52}
                    height={52}
                    priority
                  />
                </a>
                <SheetClose asChild>
                  <button
                    className="p-1 rounded-lg transition-colors"
                    style={{ color: C.onSurfaceVariant }}
                    aria-label="Close menu"
                  >
                    <Icon name="close" size={24} />
                  </button>
                </SheetClose>
              </div>

              {/* Sheet nav links */}
              <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {NAV_LINKS.map(({ label, dropdown }) => (
                  <div key={label}>
                    <SheetClose asChild>
                      <a
                        href="#"
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl font-bold text-base transition-colors"
                        style={{ color: C.onSurface, ...HL }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = C.surfaceLow)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        {label}
                        {dropdown && (
                          <Icon
                            name="chevron_right"
                            size={20}
                            style={{ color: C.onSurfaceVariant }}
                          />
                        )}
                      </a>
                    </SheetClose>
                    {dropdown && (
                      <div className="ml-4 mt-1 space-y-1">
                        {dropdown.map(({ label: dl, isAction }) => (
                          <SheetClose key={dl} asChild>
                            <a
                              href="#"
                              className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                              style={{
                                color: isAction
                                  ? C.secondary
                                  : C.onSurfaceVariant,
                                fontWeight: isAction ? 700 : 600,
                                ...BD,
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  C.surfaceLow)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "transparent")
                              }
                            >
                              {dl}
                              {isAction && (
                                <Icon
                                  name="arrow_right_alt"
                                  size={16}
                                  style={{ color: C.secondary }}
                                />
                              )}
                            </a>
                          </SheetClose>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Sheet CTA buttons */}
              <div
                className="px-6 py-6 space-y-3"
                style={{ borderTop: `1px solid ${C.outlineVariant}33` }}
              >
                <SheetClose asChild>
                  <button
                    className="w-full py-3 rounded-xl font-bold text-base transition-colors"
                    style={{
                      border: `1px solid ${C.outlineVariant}`,
                      color: C.onSurface,
                      ...BD,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = C.surfaceLow)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    Sign In
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    className="w-full py-3 rounded-xl font-bold text-base"
                    style={{
                      backgroundColor: C.primary,
                      color: "#ffffff",
                      ...BD,
                    }}
                  >
                    Call (888) 989-0150
                  </button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── FAQ Accordion Item ───────────────────────────────────────────────
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

// ─── Page ─────────────────────────────────────────────────────────────
export default function TelnovaLanding() {
  return (
    <div style={{ ...BD, backgroundColor: C.surface, color: C.onSurface }}>
      {/* ── NAVBAR ───────────────────────────────────────────────────── */}
      <Navbar />

      <main className="pt-20">
        {/* ── HERO ─────────────────────────────────────────────────── */}
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
                Telnova.ai helps you compare available services for your address
                and find the setup that fits your home and budget.
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
                  alt="Modern minimalist home office with high-end tech"
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

          {/* Atmospheric gradient */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
            style={{
              background: `linear-gradient(to left, ${C.primaryFixed}33, transparent)`,
            }}
          />
        </section>

        {/* ── SERVICES BENTO ───────────────────────────────────────── */}
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
                Integrated solutions designed to work in perfect harmony across
                your entire digital landscape.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Internet – spans 2 cols */}
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
                  Fast and reliable plans for streaming, gaming, working from
                  home, and everyday use.
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
                  Wireless options for individuals and families who want
                  performance and value.
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
                  Entertainment options built around live channels, sports,
                  movies, and streaming flexibility.
                </p>
                <a
                  href="#"
                  className="font-bold text-sm inline-flex items-center gap-1"
                  style={{ color: C.secondary, ...BD }}
                >
                  Learn More
                </a>
              </motion.div>

              {/* Security – full width dark card */}
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
                    Connected protection with smart monitoring, cameras, and
                    home automation features.
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

        {/* ── BUNDLE COMPARISON ─────────────────────────────────────── */}
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
                  /* Featured / dark card */
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
                  /* Regular card */
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
              *Prices and availability may vary by location and provider. Terms
              and conditions apply.
            </p>
          </div>
        </section>

        {/* ── WHY TELNOVA ───────────────────────────────────────────── */}
        <section
          className="py-32 overflow-hidden"
          style={{ backgroundColor: C.surfaceHigh }}
        >
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              {/* Left copy */}
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
                  Shopping for home services should feel easier. Telnova.ai
                  helps customers compare internet, TV, mobile, home phone, and
                  home security options in one place. Whether someone is moving,
                  switching, upgrading, or bundling, our team helps them
                  understand the choices available and choose the solution that
                  fits their household.
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

              {/* Right image */}
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

        {/* ── PROVIDERS ─────────────────────────────────────────────── */}
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
                Explore service options from leading providers and trusted
                partners based on your location and service needs.
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

        {/* ── FAQ ───────────────────────────────────────────────────── */}
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

        {/* ── CTA BANNER ────────────────────────────────────────────── */}
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
              Call now to compare internet, TV, mobile, and home service options
              for your address.
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
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer
        className="w-full py-20"
        style={{ backgroundColor: C.surfaceLow }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto px-8">
          <div className="space-y-6">
            <a href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Telnova logo"
                width={100}
                height={100}
              />
            </a>
            <p
              className="text-sm leading-relaxed"
              style={{ color: C.onSurface, opacity: 0.7, ...BD }}
            >
              Telnova.ai is an authorized retailer for select providers and
              service partners. Services, pricing, promotions, equipment, fees,
              and availability vary by provider and location and are subject to
              change.
            </p>
          </div>

          {[
            {
              heading: "Services",
              links: [
                "Fiber Internet",
                "Mobile Network",
                "NovaStream TV",
                "Home Security",
              ],
            },
            {
              heading: "Company",
              links: [
                "Privacy Policy",
                "Terms & Conditions",
                "Fiber Map",
                "Affiliate Program",
              ],
            },
          ].map(({ heading, links }) => (
            <div key={heading} className="space-y-4">
              <p
                className="text-sm uppercase tracking-widest font-bold"
                style={{ ...BD, color: C.primary }}
              >
                {heading}
              </p>
              <nav className="flex flex-col gap-2">
                {links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="text-sm transition-colors"
                    style={{ color: C.onSurface, opacity: 0.7, ...BD }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = C.secondary;
                      e.currentTarget.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = C.onSurface;
                      e.currentTarget.style.opacity = "0.7";
                    }}
                  >
                    {l}
                  </a>
                ))}
              </nav>
            </div>
          ))}

          <div className="space-y-4">
            <p
              className="text-sm uppercase tracking-widest font-bold"
              style={{ ...BD, color: C.primary }}
            >
              Connect
            </p>
            <nav className="flex flex-col gap-2">
              {["Contact", "Help Center"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-sm transition-colors"
                  style={{ color: C.onSurface, opacity: 0.7, ...BD }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.secondary;
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.onSurface;
                    e.currentTarget.style.opacity = "0.7";
                  }}
                >
                  {l}
                </a>
              ))}
              <div className="flex gap-4 pt-4">
                {["public", "forum", "share"].map((icon) => (
                  <Icon
                    key={icon}
                    name={icon}
                    size={22}
                    className="cursor-pointer transition-colors"
                    style={{ color: C.onSurfaceVariant }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = C.secondary)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = C.onSurfaceVariant)
                    }
                  />
                ))}
              </div>
            </nav>
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto px-8 mt-20 pt-8"
          style={{ borderTop: `1px solid ${C.outlineVariant}1a` }}
        >
          <p
            className="text-xs text-center"
            style={{ color: C.onSurface, opacity: 0.7, ...BD }}
          >
            © 2024 TELNOVA Intelligence. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
