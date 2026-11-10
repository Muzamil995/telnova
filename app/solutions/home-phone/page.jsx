"use client";

import SolutionPage from "@/components/landing/SolutionPage";

export default function HomePhoneSolutionsPage() {
  return (
    <SolutionPage
      sectionIcon="phone_in_talk"
      heroLabel="Home Phone Solutions"
      headline="Home phone options that keep households connected"
      accentPhrase="keep households connected"
      subheadline="Whether you want a traditional landline for reliability, a VoIP line bundled with your internet, or just a backup number for the house — we help you find what's available at your address and what makes practical sense."
      heroCta={{ label: "Compare Home Phone Options", href: "#" }}
      introCopy="Home phone isn't as simple as it used to be. Traditional landlines, fiber-based digital voice, and VoIP services all offer different levels of reliability, call quality, and feature sets — and the right choice depends a lot on why you need one. We carry providers that include home phone as both a standalone service and as part of a bundle, so we can help you evaluate all the options."
      audienceLabel="Who this helps"
      audienceBullets={[
        {
          icon: "elderly",
          text: "Households with older family members who rely on a reliable, familiar landline for everyday calls and emergencies.",
        },
        {
          icon: "medical_services",
          text: "Families who need a dedicated home line for medical alert systems or home alarm monitoring.",
        },
        {
          icon: "savings",
          text: "Customers who want to reduce their monthly bill by bundling home phone with internet or TV.",
        },
        {
          icon: "signal_cellular_nodata",
          text: "Households in areas with poor cell coverage who want a reliable backup line at home.",
        },
      ]}
      benefitsLabel="Why use Telnova.ai"
      benefitsBullets={[
        {
          icon: "compare_arrows",
          text: "Compare home phone options — landline, fiber voice, and VoIP — available at your specific address.",
        },
        {
          icon: "bundle",
          text: "Explore bundling possibilities that combine home phone with internet or TV for a single monthly bill.",
        },
        {
          icon: "verified",
          text: "Get clear information on included features like voicemail, call waiting, and long-distance rates.",
        },
        {
          icon: "headset_mic",
          text: "Speak to an agent who can help you decide between a standalone line and a full home services bundle.",
        },
      ]}
      supportCopy="Home phone is often the easiest addition to add to an existing service — and sometimes the best way to lower your overall bill when bundled correctly. Our agents can walk you through whether a standalone line or a bundled plan makes more sense for your household."
      ctaHeadline="Looking for a reliable home phone option?"
      ctaButton={{
        label: "Call (888) 989-0150",
        href: "8889890150",
        tel: true,
      }}
      ctaSecondary={{ label: "Compare Home Phone Plans", href: "#" }}
    />
  );
}
