"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/stores/authStore";

/**
 * Hook to protect client-side routes and check authentication
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireAuth - Whether the route requires authentication (default: true)
 * @param {string} options.redirectTo - Where to redirect if not authenticated (default: "/")
 * @returns {Object} - Auth state and utilities
 */
export function useAuth(options = {}) {
  const { requireAuth = true, redirectTo = "/" } = options;
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading, token } = useAuthStore();

  useEffect(() => {
    // If auth is required but user is not authenticated
    if (requireAuth && !isLoading && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // If user is authenticated and on signin page, redirect to dashboard
    if (isAuthenticated && pathname === "/" && !requireAuth) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, requireAuth, router, redirectTo, pathname]);

  return {
    isAuthenticated,
    user,
    isLoading,
    token,
  };
}

/**
 * Hook to get current user info from store
 */
export function useUser() {
  const { user, isAuthenticated } = useAuthStore();
  return { user, isAuthenticated };
}
