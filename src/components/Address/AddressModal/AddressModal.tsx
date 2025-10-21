import React, { useState } from "react";
import styled from "styled-components";
import ModalInput from "@/components/Header/ModalInput";
import InputTitle from "@/components/Header/InputTitle";
import SaveButton from "@/ProfileButton/Save";
import CancelButton from "@/ProfileButton/Cancel";
import PlaceSelector from "./PlaceSelector";
import ModalTitle from "./ModalTitle";
import GoogleMap from "@/components/Contact/GoogleMap";
import ToggleDefaultButton from "@/components/Buttons/ToggleDefaultButton";
import { AddressData } from "@/types";
import { addressCreate, addressUpdate } from "@/api/generated/api";
import { AddressRequest, PatchedAddressUpdateRequest } from "@/api/generated/interfaces";
import { mapPlaceToAddressType } from "@/utils/addressHelpers";

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
        const updateData: PatchedAddressUpdateRequest = {
          address_string: address,
          extra_details: additionalInfo || undefined,
          latitude: roundedLat,
          longitude: roundedLng,
          is_default: isDefault,
        };

        await addressUpdate(initialData.id!, updateData);
      } else {
        // Create new address
        const addressData: AddressRequest = {
          address_type: mapPlaceToAddressType(selectedPlace, dictionary) as any,
          address_string: address,
          extra_details: additionalInfo || undefined,
          latitude: roundedLat,
          longitude: roundedLng,
          is_default: isDefault,
        };

        await addressCreate(addressData);
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
          onSelect={initialData?.id ? () => {} : setSelectedPlace} // Disable selection during edit
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
        <GoogleMap
          variant={2}
          searchedAddress={address}
          onLocationSelect={(locationName, coords) => {
            setAddress(locationName);
            if (coords) {
              setCoordinates(coords);
            }
          }}
        />
        {/* {coordinates && (
          <div
            style={{
              marginTop: "8px",
              padding: "8px",
              backgroundColor: "#2a2a2a",
              borderRadius: "4px",
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
