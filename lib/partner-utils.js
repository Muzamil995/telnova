export const MIN_PARTNER_WITHDRAWAL_BALANCE = 50;

export function getEmptyBankDetails() {
  return {
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "checking",
  };
}

export function normalizePaymentMethod(input = {}) {
  const rawType = String(input?.type || "")
    .trim()
    .toLowerCase();

  if (rawType === "paypal") {
    return {
      type: "paypal",
      paypalEmail: String(input?.paypalEmail || "")
        .trim()
        .toLowerCase(),
      bankDetails: getEmptyBankDetails(),
    };
  }

  if (rawType === "bank") {
    const bankDetails = input?.bankDetails || {};

    return {
      type: "bank",
      paypalEmail: "",
      bankDetails: {
        accountHolderName: String(bankDetails.accountHolderName || "").trim(),
        bankName: String(bankDetails.bankName || "").trim(),
        accountNumber: String(bankDetails.accountNumber || "").trim(),
        routingNumber: String(bankDetails.routingNumber || "").trim(),
        accountType: ["checking", "savings"].includes(bankDetails.accountType)
          ? bankDetails.accountType
          : "checking",
      },
    };
  }

  return {
    type: null,
    paypalEmail: "",
    bankDetails: getEmptyBankDetails(),
  };
}

export function hasSavedPaymentMethod(paymentMethod = {}) {
  if (paymentMethod?.type === "paypal") {
    return Boolean(paymentMethod.paypalEmail);
  }

  if (paymentMethod?.type === "bank") {
    const bankDetails = paymentMethod.bankDetails || {};
    return [
      bankDetails.accountHolderName,
      bankDetails.bankName,
      bankDetails.accountNumber,
      bankDetails.routingNumber,
      bankDetails.accountType,
    ].every(Boolean);
  }

  return false;
}

export function getPaymentMethodSummary(paymentMethod = {}) {
  if (paymentMethod?.type === "paypal" && paymentMethod.paypalEmail) {
    return `PayPal (${paymentMethod.paypalEmail})`;
  }

  if (paymentMethod?.type === "bank" && hasSavedPaymentMethod(paymentMethod)) {
    const bankDetails = paymentMethod.bankDetails || {};
    const lastFour = bankDetails.accountNumber.slice(-4);
    return `${bankDetails.bankName} (${bankDetails.accountType}, ****${lastFour})`;
  }

  return "Not configured";
}

export function isEligibleForWithdrawal(currentBalance) {
  return Number(currentBalance || 0) > MIN_PARTNER_WITHDRAWAL_BALANCE;
}
