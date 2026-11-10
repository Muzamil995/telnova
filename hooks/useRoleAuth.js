"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/stores/authStore";

/**
 * Hook for role-based access control
 * @param {Object} options - Configuration options
 * @param {string[]} options.allowedRoles - Array of roles that can access this route
 * @param {string} options.redirectTo - Where to redirect if access is denied (default: "/dashboard")
 * @returns {Object} - Auth state and utilities
 */
export function useRoleAuth(options = {}) {
  const {
    allowedRoles = [],
    redirectTo = "/dashboard",
    unauthRedirectTo = "/",
  } = options;
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    const hasInvalidAuthState = isAuthenticated && !user;

    if (!isLoading && (!isAuthenticated || hasInvalidAuthState)) {
      router.replace(unauthRedirectTo);
      return;
    }

    if (!isLoading && isAuthenticated && user) {
      // Check if user's role is in the allowed roles
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push(redirectTo);
        return;
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    router,
    allowedRoles,
    redirectTo,
    unauthRedirectTo,
    pathname,
  ]);

  return {
    isAuthenticated,
    user,
    isLoading,
    hasAccess:
      allowedRoles.length === 0 || (user && allowedRoles.includes(user.role)),
  };
}
