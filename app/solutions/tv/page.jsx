"use client";

import SolutionPage from "@/components/landing/SolutionPage";

export default function TVSolutionsPage() {
  return (
    <SolutionPage
      sectionIcon="tv"
      heroLabel="TV Solutions"
      headline="TV options for how your home watches"
      accentPhrase="how your home watches"
      subheadline="From live sports and local channels to streaming-friendly bundles, we help you find a TV service that fits the way your household actually uses it — without overpaying for channels no one watches."
      heroCta={{ label: "Compare TV Options", href: "#" }}
      introCopy="TV service has changed a lot. Some households want full channel packages with DVR and locals. Others just need a few live channels alongside their streaming apps. We carry the providers that offer both — and can help you figure out which approach makes sense for your situation."
      audienceLabel="Who this helps"
      audienceBullets={[
        {
          icon: "sports",
          text: "Sports fans who need local channels and live regional sports without a cable box hassle.",
        },
        {
          icon: "family_restroom",
          text: "Families with kids looking for broad channel packages with kids' programming included.",
        },
        {
          icon: "tv_off",
          text: "Cord-cutters exploring hybrid options that mix traditional TV with streaming access.",
        },
        {
          icon: "location_on",
          text: "Households in areas where only one or two TV providers are available and want to see what's actually on offer.",
        },
      ]}
      benefitsLabel="Why use Telnova.ai"
      benefitsBullets={[
        {
          icon: "compare_arrows",
          text: "Compare channel lineups, pricing, and bundle options across available providers at your address.",
        },
        {
          icon: "receipt_long",
          text: "Understand what you're paying for — our agents explain included fees, equipment costs, and contract terms.",
        },
        {
          icon: "bundle",
          text: "Bundle TV with internet or home phone to simplify billing and potentially lower your monthly cost.",
        },
        {
          icon: "headset_mic",
          text: "Live support throughout the ordering process so you don't get lost in automated phone trees.",
        },
      ]}
      supportCopy="Our team stays current on the TV packages and promotions available through the providers we carry. If a channel lineup has changed or a bundle deal is limited-time, we'll tell you — so you can make a decision based on accurate information."
      ctaHeadline="Let's find the right TV service for your household."
      ctaButton={{
        label: "Call (888) 989-0150",
        href: "8889890150",
        tel: true,
      }}
      ctaSecondary={{ label: "Compare TV Options", href: "#" }}
    />
  );
}
