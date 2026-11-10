"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionPage } from "@/components/subscription/subscription-page";
import useAuthStore from "@/stores/authStore";
import { authAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function SubscriptionRoutePage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth({
    requireAuth: true,
    redirectTo: "/",
  });
  const { setUser, setLoading } = useAuthStore();
  const isRestrictedRole = ["admin", "operator", "partner"].includes(
    user?.role,
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        setLoading(true);
        const response = await authAPI.getProfile();
        if (response.success) {
          setUser(response.user);

          if (["admin", "operator", "partner"].includes(response.user?.role)) {
            router.replace("/portal");
            return;
          }

          // If the user already has an active paid plan they were redirected
          // here unnecessarily (stale localStorage) — send them to dashboard.
          const { plan, status } = response.user?.subscription || {};
          if (plan && plan !== "free" && status === "active") {
            router.replace("/dashboard");
            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, setLoading, setUser, router]);

  if (isLoading || !user) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#f7f9fb" }}
      >
        <div className="text-center">
          <div
            className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
            style={{
              borderColor: "#c6c6cd",
              borderTopColor: "transparent",
              borderLeftColor: "var(--brand-violet)",
            }}
          />
          <p
            className="mt-4 text-sm"
            style={{
              color: "#45464d",
              fontFamily: "var(--font-manrope, sans-serif)",
            }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (isRestrictedRole) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#f7f9fb" }}
      >
        <div className="text-center">
          <p
            className="text-sm"
            style={{
              color: "#45464d",
              fontFamily: "var(--font-manrope, sans-serif)",
            }}
          >
            Redirecting to your portal...
          </p>
        </div>
      </div>
    );
  }

  return <SubscriptionPage user={user} />;
}
