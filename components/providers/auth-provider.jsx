"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";

/**
 * Provider to ensure Zustand store hydration is complete before rendering
 * This prevents hydration mismatches when using persist middleware
 */
export function AuthProvider({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Wait for Zustand persist to hydrate from localStorage
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // Check if already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return unsubscribe;
  }, []);

  // Redirect free-plan users away from /dashboard to /subscription.
  const isFreePlan =
    isHydrated &&
    isAuthenticated &&
    user?.role === "user" &&
    (user?.subscription?.plan || "free") === "free";

  useEffect(() => {
    if (isFreePlan && pathname === "/dashboard") {
      router.replace("/subscription");
    }
  }, [isFreePlan, pathname, router]);

  // Show nothing during hydration to prevent mismatch
  if (!isHydrated) {
    return null;
  }

  // Suppress render while the redirect is in flight
  if (isFreePlan && pathname === "/dashboard") {
    return null;
  }

  return <>{children}</>;
}
