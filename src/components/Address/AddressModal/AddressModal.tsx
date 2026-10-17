import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ModalInput from "@/components/Header/ModalInput";
import InputTitle from "@/components/Header/InputTitle";
import SaveButton from "@/ProfileButton/Save";
import CancelButton from "@/ProfileButton/Cancel";
import PlaceSelector from "./PlaceSelector";
import ModalTitle from "./ModalTitle";
import dynamic from "next/dynamic";

const AddressMap = dynamic(() => import("./AddressMap"), { ssr: false });
import ToggleDefaultButton from "@/components/Buttons/ToggleDefaultButton";
import { AddressData } from "@/types";
import {
  ecommerceClientAddressesCreate,
  ecommerceClientAddressesPartialUpdate,
} from "@/api/generated/api";
import { PatchedClientAddressRequest, ClientAddress } from "@/api/generated/interfaces";
import { mapPlaceToAddressType } from "@/utils/addressHelpers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const StyledContainer = styled.div`
  width: 508px;
  height: 648px;
  background-color: #1c1c1c;
  border-radius: 20px;
  padding: 32px 24px 24px 24px;
  @media (max-width: 1080px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 20px 16px 15px 16px;
  }
`;

const StyledSelector = styled.div`
  margin-top: 42px;
  @media (max-width: 1080px) {
    padding-inline: 4px;
  }
`;

const StyledInputWrapper = styled.div`
  margin-top: 20px;
`;

const StyledMap = styled.div`
  margin-top: 20px;
`;

const StyledButton = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  @media (max-width: 1080px) {
    flex-direction: column-reverse;
  }
`;

type Props = {
  onClose: () => void;
  onSave: () => void;
  initialData?: AddressData;
  dictionary: any;
};

const AddressModal = ({ onClose, onSave, initialData, dictionary }: Props) => {
  const [selectedPlace, setSelectedPlace] = useState(initialData?.place || dictionary.cardTitle2);
  const [address, setAddress] = useState(initialData?.address || "");
  const [additionalInfo, setAdditionalInfo] = useState(initialData?.additionalInfo || "");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
    initialData?.latitude && initialData?.longitude
      ? { lat: parseFloat(initialData.latitude), lng: parseFloat(initialData.longitude) }
      : null
  );
  // Address whose coordinates are already known (picked on the map, or the saved address with
  // its stored coordinates). Forward geocoding is skipped for it to keep the more precise point.
  const lastPickedAddressRef = useRef<string | null>(
    initialData?.address && initialData?.latitude && initialData?.longitude
      ? initialData.address
      : null
  );
  const lastPickedCoordsRef = useRef(coordinates);
  const initialCenterRef = useRef(coordinates);
  const addressRef = useRef(address);
  addressRef.current = address;
  const debouncedAddress = useDebouncedValue(address.trim(), 500);
  const addressToGeocode =
    debouncedAddress && debouncedAddress !== lastPickedAddressRef.current?.trim()
      ? debouncedAddress
      : undefined;

  // Text edited and then reverted to the picked address: restore the picked coordinates
  useEffect(() => {
    if (
      debouncedAddress &&
      debouncedAddress === lastPickedAddressRef.current?.trim() &&
      lastPickedCoordsRef.current
    ) {
      setCoordinates(lastPickedCoordsRef.current);
    }
  }, [debouncedAddress]);
  const [isDefault, setIsDefault] = useState(initialData?.is_default || false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure coordinate string length doesn't exceed API limits
  const formatCoordinateForAPI = (coord: number): string => {
    const rounded = parseFloat(coord.toFixed(6));
    const coordString = rounded.toString();

    // If still too long, reduce precision further
    if (coordString.length > 10) {
      return parseFloat(coord.toFixed(5)).toString();
    }

    return coordString;
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!address.trim()) {
        setError("Address is required");
        setIsLoading(false);
        return;
      }

      // Round coordinates to 6 decimal places (accuracy ~0.1 meters)
      const roundedLat = coordinates?.lat ? formatCoordinateForAPI(coordinates.lat) : undefined;
      const roundedLng = coordinates?.lng ? formatCoordinateForAPI(coordinates.lng) : undefined;

      // Check if we're editing an existing address or creating a new one
      const isEditing = initialData && initialData.id;

      if (isEditing) {
        // Update existing address
        const updateData: PatchedClientAddressRequest = {
          label: mapPlaceToAddressType(selectedPlace, dictionary) as any,
          address,
          extra_instructions: additionalInfo || undefined,
          latitude: roundedLat,
          longitude: roundedLng,
          is_default: isDefault,
        };

        await ecommerceClientAddressesPartialUpdate(String(initialData.id!), updateData);
      } else {
        // Create new address
        // NOTE: Backend expects client to be null (it associates from auth), and requires city field
        const addressData = {
          client: null as any,
          label: mapPlaceToAddressType(selectedPlace, dictionary) as any,
          address,
          city: "tbilisi", // default city; adjust if UI adds city selection
          extra_instructions: additionalInfo || undefined,
          latitude: roundedLat,
          longitude: roundedLng,
          is_default: isDefault,
        } as unknown as ClientAddress;

        await ecommerceClientAddressesCreate(addressData);
      }

      // Call the parent callback to trigger refresh
      onSave();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          `Failed to ${initialData?.id ? "update" : "create"} address`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer>
      <ModalTitle
        text={initialData?.id ? `${dictionary.modalTitle} - Edit` : dictionary.modalTitle}
      />
      <StyledSelector>
        <PlaceSelector
          selectedPlace={selectedPlace}
          onSelect={setSelectedPlace}
          dictionary={dictionary}
        />
      </StyledSelector>
      <StyledInputWrapper>
        <InputTitle text={dictionary.inputTitle1} />
        <ModalInput
          placeholder={dictionary.placeholder1}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </StyledInputWrapper>
      <StyledInputWrapper>
        <InputTitle text={dictionary.inputTitle2} />
        <ModalInput
          placeholder={dictionary.placeholder2}
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
      </StyledInputWrapper>
      <StyledMap>
        <AddressMap
          searchedAddress={addressToGeocode}
          location={initialCenterRef.current}
          onLocationSelect={(locationName, coords) => {
            lastPickedAddressRef.current = locationName;
            setAddress(locationName);
            if (coords) {
              lastPickedCoordsRef.current = coords;
              setCoordinates(coords);
            }
          }}
          onGeocoded={(coords, geocodedAddress) => {
            // Ignore late results for text the user has since changed or replaced via a map click
            if (geocodedAddress !== addressRef.current.trim()) return;
            if (geocodedAddress === lastPickedAddressRef.current?.trim()) return;
            setCoordinates(coords);
          }}
        />
        {/* {coordinates && (
          <div
            style={{
              marginTop: "8px",
              padding: "8px",
              backgroundColor: "#2a2a2a",
              fontSize: "12px",
              color: "#aaa",
            }}
          >
            📍 Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </div>
        )} */}
      </StyledMap>
      <StyledButton>
        <ToggleDefaultButton dictionary={dictionary} isActive={isDefault} onToggle={setIsDefault} />
        <CancelButton onClick={onClose} dictionary={dictionary} disabled={isLoading} />
        <SaveButton
          onSave={handleSave}
          dictionary={dictionary}
          disabled={!address.trim() || isLoading}
          isLoading={isLoading}
        />
      </StyledButton>
      {error && (
        <div
          style={{
            color: "#ff4444",
            fontSize: "14px",
            marginTop: "20px",
            textAlign: "center",
            position: "absolute",
            left: "59%",
            top: "28px",
            maxWidth: "120px",
          }}
        >
          {error}
        </div>
      )}
    </StyledContainer>
  );
};

export default AddressModal;
