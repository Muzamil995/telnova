"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Icon from "@/components/landing/Icon";
import { C, HL, BD, SHADOW } from "@/components/landing/tokens";
import { SubscriptionPlans } from "@/components/subscription/subscription-plans";
import { subscriptionAPI } from "@/lib/api";

export function SubscriptionPage({ user }) {
  const plan = user?.subscription?.plan || "free";
  const [loadingPlan, setLoadingPlan] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);

  const handleSelectPlan = async (selectedPlan) => {
    if (!selectedPlan) return;
    try {
      setLoadingPlan(selectedPlan);
      const response = await subscriptionAPI.createCheckout({
        plan: selectedPlan,
      });
      if (!response?.success || !response?.checkoutUrl) {
        toast.error(response?.message || "Failed to start checkout");
        return;
      }
      window.location.href = response.checkoutUrl;
    } catch (error) {
      toast.error(error?.message || "Failed to start checkout");
    } finally {
      setLoadingPlan("");
    }
  };

  const handleManageBilling = async () => {
    try {
      setPortalLoading(true);
      const response = await subscriptionAPI.createPortalSession();
      if (!response?.success || !response?.url) {
        toast.error(response?.message || "Failed to open billing portal");
        return;
      }
      window.location.href = response.url;
    } catch (error) {
      toast.error(error?.message || "Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  if (plan !== "free") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
        style={{ backgroundColor: C.surface }}
      >
        <Link href="/" className="mb-10">
          <Image
            src="/logo.svg"
            alt="Telnova"
            width={110}
            height={44}
            priority
          />
        </Link>

        <div
          className="w-full max-w-md rounded-2xl p-8"
          style={{
            backgroundColor: C.surfaceLowest,
            border: `1px solid ${C.outlineVariant}33`,
            boxShadow: "0 20px 40px rgba(25,28,30,0.06)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: C.secondaryFixed }}
            >
              <Icon
                name="verified"
                size={20}
                style={{ color: C.onSecondaryFixedVariant }}
              />
            </div>
            <div>
              <h1
                className="text-lg font-extrabold"
                style={{ ...HL, color: C.primary }}
              >
                Your subscription
              </h1>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold capitalize"
                style={{
                  backgroundColor: C.secondaryFixed,
                  color: C.onSecondaryFixedVariant,
                  ...BD,
                }}
              >
                {plan}
              </span>
            </div>
          </div>

          <p
            className="mb-6 text-sm leading-relaxed"
            style={{ color: C.onSurfaceVariant, ...BD }}
          >
            You currently have full access to paid features. Manage renewals,
            payment methods, invoices, and cancellations in the Stripe Billing
            Portal.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: C.primary, color: "#ffffff", ...BD }}
            >
              {portalLoading ? "Opening portal..." : "Manage billing"}
            </button>
            <Link
              href="/dashboard"
              className="w-full py-3 rounded-xl font-bold text-sm text-center transition-colors"
              style={{
                border: `1.5px solid ${C.outlineVariant}`,
                color: C.onSurface,
                ...BD,
              }}
            >
              Continue to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: C.surface }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-30 px-6 py-4"
        style={{
          backgroundColor: C.surfaceLowest,
          borderBottom: `1px solid ${C.outlineVariant}33`,
          boxShadow: "0 1px 12px rgba(25,28,30,0.06)",
        }}
      >
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Telnova"
            width={100}
            height={40}
            priority
          />
        </Link>
      </div>

      <main className="flex-1 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-10">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{
                backgroundColor: C.secondaryFixed,
                color: C.onSecondaryFixedVariant,
                ...BD,
              }}
            >
              <Icon name="lock" size={12} />
              Subscription Required
            </span>
            <h1
              className="text-3xl font-extrabold tracking-tight sm:text-4xl"
              style={{ ...HL, color: C.primary }}
            >
              Choose your plan
            </h1>
            <p
              className="mt-3 text-base max-w-lg mx-auto"
              style={{ color: C.onSurfaceVariant, ...BD }}
            >
              Subscribe to access our services. You cannot use our services
              without an active subscription.
            </p>
          </div>

          <SubscriptionPlans
            currentPlan={plan}
            loadingPlan={loadingPlan}
            onSelectPlan={handleSelectPlan}
          />
        </div>
      </main>
    </div>
  );
}
