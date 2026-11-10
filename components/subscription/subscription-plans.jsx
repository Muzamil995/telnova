import { PlanCard } from "@/components/subscription/plan-card";

const plans = [
  {
    name: "monthly",
    displayName: "Monthly Support",
    price: "$9.99 / month",
    tagline: "Perfect if you want flexible, month-to-month help.",
    features: [
      "Priority access to our support team",
      "Help with internet, mobile, TV & home security issues",
      "Step-by-step troubleshooting and guidance",
      "Provider contact support (we speak with them with your authorization)",
      "Follow-ups and status updates until you have a clear outcome",
    ],
    ctaText: "Start Monthly",
    microcopy: "Cancel or change your plan anytime in your account.",
  },
  {
    name: "yearly",
    displayName: "Yearly Support",
    price: "$99.99 / year",
    tagline: "Best value for households — save vs monthly.",
    features: [
      "Everything in Monthly, plus:",
      "One less bill to think about (annual coverage)",
      "Priority handling for repeat issues and ongoing cases",
      "Great for families managing multiple services/providers",
    ],
    ctaText: "Go Yearly (Save More)",
    microcopy: "Renews yearly unless you cancel.",
    popular: true,
  },
  {
    name: "lifetime",
    displayName: "Lifetime Support",
    price: "$199.99 one-time",
    tagline: "Pay once, get support for life.",
    features: [
      "Everything in Yearly, plus:",
      "One-time payment — no renewals",
      "Long-term peace of mind for all your services",
      "Best for anyone who hates dealing with support calls",
    ],
    ctaText: "Get Lifetime Access",
    microcopy: "Lifetime access for as long as the service is available.",
    badge: "Best deal",
  },
];

export function SubscriptionPlans({
  currentPlan = "free",
  loadingPlan = "",
  onSelectPlan,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard
          key={plan.name}
          planKey={plan.name}
          name={plan.displayName}
          price={plan.price}
          tagline={plan.tagline}
          features={plan.features}
          ctaText={plan.ctaText}
          microcopy={plan.microcopy}
          popular={plan.popular}
          badge={plan.badge}
          current={currentPlan === plan.name}
          isLoading={loadingPlan === plan.name}
          onSelect={onSelectPlan}
        />
      ))}
    </div>
  );
}
