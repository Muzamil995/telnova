"use client";

import SolutionPage from "@/components/landing/SolutionPage";

export default function InternetSolutionsPage() {
  return (
    <SolutionPage
      sectionIcon="wifi"
      heroLabel="Internet Solutions"
      headline="Internet solutions for modern households"
      accentPhrase="modern households"
      subheadline="Whether you're working from home, streaming in multiple rooms, or just need a reliable connection that keeps up with your family — we help you find the right internet service where you live."
      heroCta={{ label: "Check Internet Availability", href: "#" }}
      introCopy="Not every address has access to every provider, and not every plan fits every household's needs. At Telnova.ai, we help you explore what's actually available at your address — across multiple providers — so you can make an informed decision without having to research a dozen different sites."
      audienceLabel="Who this helps"
      audienceBullets={[
        {
          icon: "home",
          text: "Households switching providers after a contract ends or after moving to a new address.",
        },
        {
          icon: "work",
          text: "Remote workers who need reliable upload speeds for video calls and cloud tools.",
        },
        {
          icon: "devices",
          text: "Families with multiple devices, gamers, or heavy streamers who've outgrown their current plan.",
        },
        {
          icon: "signal_cellular_nodata",
          text: "Customers in areas with limited ISP options who want to see every available choice.",
        },
      ]}
      benefitsLabel="Why use Telnova.ai"
      benefitsBullets={[
        {
          icon: "compare_arrows",
          text: "Compare speeds, pricing, and contract terms across available providers at one address.",
        },
        {
          icon: "record_voice_over",
          text: "Speak to a live agent who can explain what each plan actually includes — no fine-print surprises.",
        },
        {
          icon: "bolt",
          text: "Place your order through us and get connected faster, with support if anything goes wrong during setup.",
        },
        {
          icon: "star_rate",
          text: "No bias toward any single provider — we help you find what fits your needs, not what pays the most.",
        },
      ]}
      supportCopy="Our agents are familiar with the service areas, speed tiers, and contract structures for all the major providers we carry. When you call or chat with us, you're talking to someone who can actually help you compare — not a bot reading from a script."
      ctaHeadline="Ready to find the right internet plan for your address?"
      ctaButton={{ label: "Compare Internet Plans", href: "#" }}
      ctaSecondary={{ label: "Check Availability First", href: "#" }}
    />
  );
}
