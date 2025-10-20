export type AddressData = {
  id?: number;
  place: string;
  address: string;
  additionalInfo?: string;
  latitude?: string;
  longitude?: string;
  address_type?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type PaymentMethodData = {
  id?: string;
  cardType: "visa" | "mastercard" | "amex";
  cardNumber: string; // 12 digits, masked
  cvv: string; // 4 digits
  expiry?: string; // MMYY digits only
  lastFourDigits?: string; // For display purposes
};
