export type CardType = "visa" | "mastercard" | "amex";

/**
 * Normalize a card brand reported by the API (e.g. "MC", "MasterCard Debit",
 * "American Express") to one of the brands the UI has logos for.
 */
export const normalizeCardType = (raw?: string | null): CardType => {
  const value = (raw || "").toLowerCase().trim();
  if (value.includes("mastercard") || value === "mc") return "mastercard";
  if (value.includes("amex") || value === "american express") return "amex";
  return "visa";
};
