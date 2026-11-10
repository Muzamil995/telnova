"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import useAuthStore from "@/stores/authStore";
import { authAPI } from "@/lib/api";

export default function DashboardPage() {
  // Protect this route - requires authentication and user role
  const { isAuthenticated, user, isLoading } = useRoleAuth({
    allowedRoles: ["user"],
    redirectTo: "/portal",
  });
  const { setUser, setLoading } = useAuthStore();

  // Fetch latest user data on mount
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
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, setUser, setLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect is handled by useRoleAuth; show a visible transition state.
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <DashboardLayout user={user} />;
}
