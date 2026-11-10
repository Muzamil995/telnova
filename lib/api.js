/**
 * API client utilities for making authenticated requests
 */

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic API request handler
 */
async function apiRequest(url, options = {}) {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Include cookies for authentication
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.message || "An error occurred",
        response.status,
        data,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // Network or parsing error
    throw new APIError(error.message || "Network error occurred", 0, null);
  }
}

/**
 * Auth API methods
 */
export const authAPI = {
  /**
   * Sign up a new user
   */
  signup: async ({
    fullName,
    email,
    password,
    phoneNumber,
    verificationType,
  }) => {
    return apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        fullName,
        email,
        password,
        phoneNumber,
        verificationType,
      }),
    });
  },

  /**
   * Sign in existing user
   */
  signin: async ({ email, password }) => {
    return apiRequest("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Request password reset email
   */
  forgotPassword: async ({ email }) => {
    return apiRequest("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password using token
   */
  resetPassword: async ({ token, password }) => {
    return apiRequest("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  },

  /**
   * Verify OTP
   */
  verifyOTP: async ({ userId, email, otp, type = "email" }) => {
    return apiRequest("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ userId, email, otp, type }),
    });
  },

  /**
   * Resend OTP
   */
  resendOTP: async ({
    userId,
    email,
    type = "email",
    purpose = "verification",
  }) => {
    return apiRequest("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ userId, email, type, purpose }),
    });
  },

  /**
   * Logout user
   */
  logout: async () => {
    return apiRequest("/api/auth/logout", {
      method: "POST",
    });
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    return apiRequest("/api/auth/me", {
      method: "GET",
    });
  },
};

/**
 * Support API methods
 */
export const supportAPI = {
  /**
   * Chat with support assistant
   */
  chat: async ({ messages }) => {
    return apiRequest("/api/support/chat", {
      method: "POST",
      body: JSON.stringify({ messages }),
    });
  },

  /**
   * Create support ticket
   */
  createTicket: async ({ conversationHistory }) => {
    return apiRequest("/api/support/ticket", {
      method: "POST",
      body: JSON.stringify({ conversationHistory }),
    });
  },

  /**
   * Get all tickets for logged in user
   */
  getTickets: async () => {
    return apiRequest("/api/support/ticket", {
      method: "GET",
    });
  },

  /**
   * Get recent tickets (limit to 4)
   */
  getRecentTickets: async (limit = 4) => {
    return apiRequest(`/api/support/ticket?limit=${limit}`, {
      method: "GET",
    });
  },

  /**
   * Get a single ticket by ticket number
   */
  getTicketDetails: async (ticketNumber) => {
    return apiRequest(`/api/support/ticket/${ticketNumber}`, {
      method: "GET",
    });
  },

  /**
   * Get all tickets (admin/operator only)
   */
  getAllTickets: async (page = 1, limit = 20, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return apiRequest(`/api/support/tickets/all?${params}`, {
      method: "GET",
    });
  },

  /**
   * Mark a ticket as resolved (admin/operator only)
   */
  markTicketAsResolved: async (ticketNumber) => {
    return apiRequest(`/api/support/tickets/${ticketNumber}/resolve`, {
      method: "PATCH",
    });
  },

  /**
   * Get ticket details with conversation (admin/operator only)
   */
  getPortalTicketDetails: async (ticketNumber) => {
    return apiRequest(`/api/support/tickets/${ticketNumber}/details`, {
      method: "GET",
    });
  },
};

/**
 * Users API methods (admin only)
 */
export const usersAPI = {
  /**
   * Get all users with pagination/search
   */
  getAllUsers: async (page = 1, limit = 20, search = "") => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search?.trim()) {
      params.set("search", search.trim());
    }

    return apiRequest(`/api/users?${params.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Update a user (admin only)
   */
  updateUser: async (userId, updateData) => {
    return apiRequest(`/api/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
  },
};

/**
 * Partner API methods
 */
export const partnersAPI = {
  /**
   * Get all partners for admin portal
   */
  getAdminPartners: async (page = 1, limit = 20, search = "") => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search?.trim()) {
      params.set("search", search.trim());
    }

    return apiRequest(`/api/admin/partners?${params.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Create a new partner account and profile
   */
  createPartner: async (payload) => {
    return apiRequest("/api/admin/partners", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get a single partner with withdrawal history for the admin portal
   */
  getAdminPartnerDetails: async (partnerId) => {
    return apiRequest(`/api/admin/partners/${partnerId}`, {
      method: "GET",
    });
  },

  /**
   * Update a partner balance from the admin portal
   */
  updatePartnerBalance: async (partnerId, currentBalance) => {
    return apiRequest(`/api/admin/partners/${partnerId}`, {
      method: "PATCH",
      body: JSON.stringify({ currentBalance }),
    });
  },

  /**
   * Get partner withdrawals for admin portal
   */
  getAdminWithdrawals: async (status = "pending", limit = 50) => {
    const params = new URLSearchParams({
      status,
      limit: limit.toString(),
    });

    return apiRequest(`/api/admin/partners/withdrawals?${params.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Mark a partner withdrawal as paid
   */
  markWithdrawalPaid: async (withdrawalId, payload = {}) => {
    return apiRequest(`/api/admin/partners/withdrawals/${withdrawalId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get partner TFN statement requests for admin portal
   */
  getAdminStatements: async (status = "pending", limit = 50) => {
    const params = new URLSearchParams({
      status,
      limit: limit.toString(),
    });

    return apiRequest(`/api/admin/partners/statements?${params.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Mark a TFN statement request as delivered
   */
  markStatementDelivered: async (statementId, payload = {}) => {
    return apiRequest(`/api/admin/partners/statements/${statementId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get current partner profile and withdrawal history
   */
  getPartnerProfile: async () => {
    return apiRequest("/api/partners/me", {
      method: "GET",
    });
  },

  /**
   * Save partner payment method
   */
  savePaymentMethod: async (paymentMethod) => {
    return apiRequest("/api/partners/payment-method", {
      method: "PATCH",
      body: JSON.stringify({ paymentMethod }),
    });
  },

  /**
   * Change the authenticated partner password
   */
  changePassword: async ({ currentPassword, newPassword }) => {
    return apiRequest("/api/partners/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  /**
   * Request a withdrawal for the current partner
   */
  requestWithdrawal: async (payload = {}) => {
    return apiRequest("/api/partners/withdrawals", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get partner withdrawal history
   */
  getWithdrawalHistory: async () => {
    return apiRequest("/api/partners/withdrawals", {
      method: "GET",
    });
  },

  /**
   * Request a TFN statement for the current partner
   */
  requestStatement: async (payload = {}) => {
    return apiRequest("/api/partners/statements", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get partner TFN statement request history
   */
  getStatementHistory: async () => {
    return apiRequest("/api/partners/statements", {
      method: "GET",
    });
  },
};

/**
 * Subscription API methods
 */
export const subscriptionAPI = {
  /**
   * Start Stripe checkout for selected plan
   */
  createCheckout: async ({ plan }) => {
    return apiRequest("/api/subscription/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  },

  /**
   * Create Stripe billing portal session
   */
  createPortalSession: async () => {
    return apiRequest("/api/subscription/portal", {
      method: "POST",
    });
  },
};

/**
 * Export APIError for error handling
 */
export { APIError };
