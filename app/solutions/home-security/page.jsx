"use client";

import SolutionPage from "@/components/landing/SolutionPage";

export default function HomeSecuritySolutionsPage() {
  return (
    <SolutionPage
      sectionIcon="security"
      heroLabel="Home Security Solutions"
      headline="Home security that helps your household stay protected"
      accentPhrase="stay protected"
      subheadline="From professional monitoring to smart cameras and entry sensors, we help you find a home security option that matches your household's setup — and your budget."
      heroCta={{ label: "Compare Home Security", href: "#" }}
      introCopy="Home security has become more accessible — and more complex — than ever. There are systems with 24/7 professional monitoring, others that rely on app-based alerts, and everything in between. We carry options from established security providers and help you understand the differences before you commit to an installation or a multi-year contract."
      audienceLabel="Who this helps"
      audienceBullets={[
        {
          icon: "home",
          text: "Homeowners setting up security for the first time who want to understand what's available without reading pages of specs.",
        },
        {
          icon: "apartment",
          text: "Renters looking for flexible, low-commitment security options that can move with them.",
        },
        {
          icon: "family_restroom",
          text: "Families who want professional monitoring so someone is always watching — even when they're away.",
        },
        {
          icon: "upgrade",
          text: "Existing customers with outdated systems looking to upgrade equipment or switch to a more reliable monitoring service.",
        },
      ]}
      benefitsLabel="Why use Telnova.ai"
      benefitsBullets={[
        {
          icon: "compare_arrows",
          text: "Compare security packages — including equipment, monitoring fees, and contract length — side by side.",
        },
        {
          icon: "verified_user",
          text: "Understand what monitoring levels are available: professional, self-monitored, or app-only.",
        },
        {
          icon: "wifi",
          text: "Find out if you can bundle home security with your existing internet or phone service through a single provider.",
        },
        {
          icon: "headset_mic",
          text: "Get help from a live agent who can walk through installation requirements, camera options, and plan terms.",
        },
      ]}
      supportCopy="Security is a decision most households don't revisit often — so making the right choice matters. Our agents are familiar with the providers and packages we carry and can give you a clear picture of what you're getting before you sign anything."
      ctaHeadline="Ready to explore home security options for your address?"
      ctaButton={{ label: "Check Home Security Options", href: "#" }}
      ctaSecondary={{ label: "Compare Providers", href: "/providers" }}
    />
  );
}
