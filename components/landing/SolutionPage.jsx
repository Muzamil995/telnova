"use client";

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

function SectionLabel({ icon, children }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
      style={{
        backgroundColor: C.secondaryFixed,
        color: C.onSecondaryFixedVariant,
        ...BD,
      }}
    >
      {icon && <Icon name={icon} fill={1} size={14} />}
      {children}
    </div>
  );
}

function BulletCard({ icon, text, delay = 0 }) {
  return (
    <motion.div
      variants={stagger(delay)}
      className="flex items-start gap-4 p-5 rounded-2xl"
      style={{ backgroundColor: C.surfaceLowest, ...SHADOW }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: C.secondaryFixed }}
      >
        <Icon
          name={icon}
          size={20}
          style={{ color: C.onSecondaryFixedVariant }}
        />
      </div>
      <p
        className="text-base font-medium leading-relaxed"
        style={{ color: C.onSurface, ...BD }}
      >
        {text}
      </p>
    </motion.div>
  );
}

/**
 * Shared solution page layout.
 *
 * Props:
 *   sectionIcon      – Material Symbol name for section labels
 *   heroLabel        – small label above headline
 *   headline         – h1 text (last word or phrase will be accent-colored if accentWord set)
 *   accentPhrase     – substring of headline to color with C.secondary
 *   subheadline      – paragraph under h1
 *   heroCta          – { label, href, tel? }
 *   introCopy        – paragraph below hero
 *   audienceLabel    – heading above audience bullets
 *   audienceBullets  – [{ icon, text }]
 *   benefitsLabel    – heading above benefit bullets
 *   benefitsBullets  – [{ icon, text }]
 *   supportCopy      – paragraph below benefits
 *   ctaHeadline      – CTA section h2
 *   ctaButton        – { label, href, tel? }
 *   ctaSecondary     – optional { label, href } ghost button
 */
export default function SolutionPage({
  sectionIcon = "category",
  heroLabel,
  headline,
  accentPhrase,
  subheadline,
  heroCta,
  introCopy,
  audienceLabel,
  audienceBullets = [],
  benefitsLabel,
  benefitsBullets = [],
  supportCopy,
  ctaHeadline,
  ctaButton,
  ctaSecondary,
}) {
  // Split headline around accentPhrase for coloring
  const headlineParts = accentPhrase
    ? headline.split(accentPhrase)
    : [headline];

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
          <div className="relative max-w-4xl mx-auto px-8 text-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            >
              {heroLabel && (
                <motion.div variants={stagger(0)}>
                  <SectionLabel icon={sectionIcon}>{heroLabel}</SectionLabel>
                </motion.div>
              )}

              <motion.h1
                variants={stagger(0.05)}
                className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[0.95]"
                style={{ ...HL, color: C.primary }}
              >
                {accentPhrase ? (
                  <>
                    {headlineParts[0]}
                    <span style={{ color: C.secondary }}>{accentPhrase}</span>
                    {headlineParts[1]}
                  </>
                ) : (
                  headline
                )}
              </motion.h1>

              <motion.p
                variants={stagger(0.1)}
                className="text-xl leading-relaxed max-w-2xl mx-auto mb-10"
                style={{ color: C.onSurfaceVariant, ...BD }}
              >
                {subheadline}
              </motion.p>

              {heroCta && (
                <motion.div variants={stagger(0.15)}>
                  {heroCta.tel ? (
                    <a
                      href={`tel:${heroCta.href}`}
                      className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: C.primary,
                        color: "#ffffff",
                        ...BD,
                      }}
                    >
                      <Icon name="call" fill={1} size={22} />
                      {heroCta.label}
                    </a>
                  ) : (
                    <a
                      href={heroCta.href}
                      className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: C.primary,
                        color: "#ffffff",
                        ...BD,
                      }}
                    >
                      {heroCta.label}
                      <Icon name="arrow_forward" size={20} />
                    </a>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── INTRO COPY ───────────────────────────────────────────── */}
        {introCopy && (
          <section className="py-14" style={{ backgroundColor: C.surfaceLow }}>
            <div className="max-w-4xl mx-auto px-8">
              <motion.p
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                variants={fadeUp}
                className="text-lg leading-relaxed"
                style={{ color: C.onSurfaceVariant, ...BD }}
              >
                {introCopy}
              </motion.p>
            </div>
          </section>
        )}

        {/* ── AUDIENCE + BENEFITS ──────────────────────────────────── */}
        {(audienceBullets.length > 0 || benefitsBullets.length > 0) && (
          <section className="py-24" style={{ backgroundColor: C.surface }}>
            <div className="max-w-7xl mx-auto px-8">
              <div
                className={`grid grid-cols-1 ${audienceBullets.length > 0 && benefitsBullets.length > 0 ? "lg:grid-cols-2" : ""} gap-16`}
              >
                {audienceBullets.length > 0 && (
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={VIEWPORT}
                    variants={{
                      show: { transition: { staggerChildren: 0.08 } },
                    }}
                  >
                    {audienceLabel && (
                      <motion.div variants={fadeUp} className="mb-8">
                        <SectionLabel icon="person">
                          {audienceLabel}
                        </SectionLabel>
                        <h2
                          className="text-3xl font-extrabold tracking-tight"
                          style={{ ...HL, color: C.primary }}
                        >
                          {audienceLabel}
                        </h2>
                      </motion.div>
                    )}
                    <div className="flex flex-col gap-4">
                      {audienceBullets.map((b, i) => (
                        <BulletCard
                          key={b.text}
                          icon={b.icon}
                          text={b.text}
                          delay={i * 0.06}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {benefitsBullets.length > 0 && (
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={VIEWPORT}
                    variants={{
                      show: { transition: { staggerChildren: 0.08 } },
                    }}
                  >
                    {benefitsLabel && (
                      <motion.div variants={fadeUp} className="mb-8">
                        <SectionLabel icon={sectionIcon}>
                          {benefitsLabel}
                        </SectionLabel>
                        <h2
                          className="text-3xl font-extrabold tracking-tight"
                          style={{ ...HL, color: C.primary }}
                        >
                          {benefitsLabel}
                        </h2>
                      </motion.div>
                    )}
                    <div className="flex flex-col gap-4">
                      {benefitsBullets.map((b, i) => (
                        <BulletCard
                          key={b.text}
                          icon={b.icon}
                          text={b.text}
                          delay={i * 0.06}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── SUPPORT COPY ──────────────────────────────────────────── */}
        {supportCopy && (
          <section className="py-14" style={{ backgroundColor: C.surfaceLow }}>
            <div className="max-w-4xl mx-auto px-8">
              <motion.p
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                variants={fadeUp}
                className="text-lg leading-relaxed"
                style={{ color: C.onSurfaceVariant, ...BD }}
              >
                {supportCopy}
              </motion.p>
            </div>
          </section>
        )}

        {/* ── CTA BLOCK ─────────────────────────────────────────────── */}
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
              className="text-4xl md:text-5xl font-black tracking-tighter mb-10 leading-tight"
              style={{ ...HL, color: "#ffffff" }}
            >
              {ctaHeadline}
            </motion.h2>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {ctaButton.tel ? (
                <a
                  href={`tel:${ctaButton.href}`}
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: C.secondary,
                    color: "#ffffff",
                    boxShadow: "0 8px 32px rgba(0,81,213,0.35)",
                    ...BD,
                  }}
                >
                  <Icon name="call" fill={1} size={22} />
                  {ctaButton.label}
                </a>
              ) : (
                <a
                  href={ctaButton.href}
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: C.secondary,
                    color: "#ffffff",
                    boxShadow: "0 8px 32px rgba(0,81,213,0.35)",
                    ...BD,
                  }}
                >
                  {ctaButton.label}
                  <Icon name="arrow_forward" size={20} />
                </a>
              )}

              {ctaSecondary && (
                <a
                  href={ctaSecondary.href}
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
                  {ctaSecondary.label}
                  <Icon name="arrow_forward" size={20} />
                </a>
              )}
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
