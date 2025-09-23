import { Address } from "@/api/generated/interfaces";
import { AddressData } from "@/types";

/**
 * Maps API address types to dictionary keys for display
 */
export const mapAddressTypeToPlace = (addressType: any, dictionary: any): string => {
  const typeString = typeof addressType === "string" ? addressType : String(addressType || "");

  switch (typeString) {
    case "home":
      return dictionary.cardTitle2 || dictionary.addressOption1 || "Home";
    case "work":
      return dictionary.cardTitle3 || dictionary.addressOption2 || "Work";
    case "other":
      return dictionary.cardTitle4 || dictionary.addressOption3 || "Other";
    default:
      return dictionary.cardTitle4 || dictionary.addressOption3 || "Other";
  }
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
export const convertAddressToAddressData = (address: Address, dictionary: any): AddressData => {
  return {
    id: address.id,
    place: mapAddressTypeToPlace(address.address_type, dictionary),
    address: address.address_string,
    additionalInfo: address.extra_details,
    latitude: address.latitude,
    longitude: address.longitude,
    address_type: address.address_type as unknown as string,
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
    address_type: mapPlaceToAddressType(addressData.place, dictionary) as any,
    address_string: addressData.address,
    extra_details: addressData.additionalInfo || undefined,
    latitude: addressData.latitude,
    longitude: addressData.longitude,
    is_default: addressData.is_default || false,
  };
};
