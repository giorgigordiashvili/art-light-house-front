import { ClientAddress } from "@/api/generated/interfaces";
import { AddressData } from "@/types";

/**
 * Maps API address types to dictionary keys for display
 */
export const mapAddressTypeToPlace = (label: any, dictionary: any): string => {
  const raw = typeof label === "string" ? label : String(label || "");
  const typeString = raw.trim().toLowerCase();

  // Handle canonical types
  if (typeString === "home") return dictionary.cardTitle2 || dictionary.addressOption1 || "Home";
  if (typeString === "work") return dictionary.cardTitle3 || dictionary.addressOption2 || "Work";
  if (typeString === "other") return dictionary.cardTitle4 || dictionary.addressOption3 || "Other";

  // Handle already-localized labels falling back to known dictionary values
  if (raw === dictionary.cardTitle2 || raw === dictionary.addressOption1) {
    return dictionary.cardTitle2 || dictionary.addressOption1 || "Home";
  }
  if (raw === dictionary.cardTitle3 || raw === dictionary.addressOption2) {
    return dictionary.cardTitle3 || dictionary.addressOption2 || "Work";
  }
  if (raw === dictionary.cardTitle4 || raw === dictionary.addressOption3) {
    return dictionary.cardTitle4 || dictionary.addressOption3 || "Other";
  }

  // Default
  return dictionary.cardTitle4 || dictionary.addressOption3 || "Other";
};

/**
 * Maps dictionary place names to API address types
 */
export const mapPlaceToAddressType = (place: string, dictionary: any): string => {
  if (place === dictionary.addressOption1 || place === dictionary.cardTitle2) {
    return "home";
  } else if (place === dictionary.addressOption2 || place === dictionary.cardTitle3) {
    return "work";
  } else if (place === dictionary.addressOption3 || place === dictionary.cardTitle4) {
    return "other";
  }
  return "other"; // default fallback
};

/**
 * Converts API Address object to AddressData for component use
 */
export const convertAddressToAddressData = (
  address: ClientAddress,
  dictionary: any
): AddressData => {
  return {
    id: address.id,
    place: mapAddressTypeToPlace(address.label, dictionary),
    address: address.address,
    additionalInfo: address.extra_instructions,
    latitude: address.latitude,
    longitude: address.longitude,
    address_type: address.label as unknown as string,
    is_default: address.is_default,
    created_at: address.created_at,
    updated_at: address.updated_at,
  };
};

/**
 * Converts AddressData to API Address request format
 */
export const convertAddressDataToAddressRequest = (addressData: AddressData, dictionary: any) => {
  return {
    label: mapPlaceToAddressType(addressData.place, dictionary) as any,
    address: addressData.address,
    extra_instructions: addressData.additionalInfo || undefined,
    latitude: addressData.latitude,
    longitude: addressData.longitude,
    is_default: addressData.is_default || false,
  } as Partial<ClientAddress>;
};
