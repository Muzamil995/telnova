import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        }),

      logout: async () => {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
        const logoutUrl = appUrl
          ? `${appUrl}/api/auth/logout`
          : "/api/auth/logout";

        try {
          // Wait for server cookie clear to avoid route guard race conditions.
          await fetch(logoutUrl, {
            method: "POST",
            credentials: "include",
          });
        } catch (error) {
          console.error(error);
        } finally {
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth-storage");
          }

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      // Check if user has active subscription
      hasActiveSubscription: () => {
        const { user } = get();
        return (
          user?.subscription?.status === "active" &&
          user?.subscription?.plan !== "free"
        );
      },

      // Check if user is verified
      isVerified: () => {
        const { user } = get();
        return user?.emailVerified || user?.phoneVerified;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
