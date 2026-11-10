"use client";

import SolutionPage from "@/components/landing/SolutionPage";

export default function MobileSolutionsPage() {
  return (
    <SolutionPage
      sectionIcon="smartphone"
      heroLabel="Mobile Solutions"
      headline="Mobile service options built for everyday life"
      accentPhrase="built for everyday life"
      subheadline="Whether you're looking to switch carriers, add a line for a family member, or bundle wireless with your home services, we help you explore what's available and what actually makes sense for your usage."
      heroCta={{ label: "Compare Mobile Options", href: "#" }}
      introCopy="Mobile is one of the most competitive categories in telecom — and one of the most confusing. Plan names change constantly, promos expire, and hidden fees make it hard to know what you're actually paying. We help simplify the comparison process so you can find a plan that fits how you use your phone, not just what's being advertised this month."
      audienceLabel="Who this helps"
      audienceBullets={[
        {
          icon: "person",
          text: "Single-line customers looking to lower their monthly bill without losing coverage or data.",
        },
        {
          icon: "family_restroom",
          text: "Families looking to consolidate multiple lines under one plan — or split up shared plans that no longer work.",
        },
        {
          icon: "home",
          text: "Homeowners exploring bundles that combine mobile with their home internet or TV service.",
        },
        {
          icon: "swap_horiz",
          text: "Anyone switching carriers after a contract ends or after pricing changes from their current provider.",
        },
      ]}
      benefitsLabel="Why use Telnova.ai"
      benefitsBullets={[
        {
          icon: "compare_arrows",
          text: "See mobile options from providers we carry — side by side, without the carrier's own spin.",
        },
        {
          icon: "verified",
          text: "Understand coverage, data caps, and hotspot limits before you commit to a plan.",
        },
        {
          icon: "savings",
          text: "Identify whether bundling mobile with home internet could lower your total monthly spend.",
        },
        {
          icon: "headset_mic",
          text: "Talk to a real person who can walk you through porting a number, bundling, or activating a new line.",
        },
      ]}
      supportCopy="Our agents can help you figure out whether a wireless switch makes sense for your household — and handle the process of getting set up with minimal friction. We're not locked into one carrier, so the advice you get is based on what works for you."
      ctaHeadline="Thinking about switching or adding a line?"
      ctaButton={{
        label: "Call (888) 989-0150",
        href: "8889890150",
        tel: true,
      }}
      ctaSecondary={{ label: "Compare Mobile Options", href: "#" }}
    />
  );
}
