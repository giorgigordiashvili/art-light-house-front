"use client";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import InputWithLabel from "./Input";
import SaveButton from "@/ProfileButton/Save";
import Cancel from "@/ProfileButton/Cancel";
import { User } from "@/api/generated/interfaces";
import { useProfileUpdate } from "@/hooks/useProfileUpdate";
import { useAuth } from "@/contexts/AuthContext";
const StylePersonal = styled.div`
  /* width: 800px; */
  width: 100%;
  max-width: 100%;
  min-height: 544px;
  padding: 24px;
  background: #1a1a1a96;
  border-radius: 17px;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  z-index: 1;

  @media (max-width: 1080px) {
    width: 100%;
    padding: 16px;
    min-height: auto;
  }
`;

const InputsWrapper = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  flex: 1;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  flex: 1;
`;
const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  position: absolute;
  bottom: 24px;
  right: 24px;

  @media (max-width: 1080px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    position: static;
    margin-top: 24px;
  }
`;
const Title = styled.p`
  position: relative;
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
  padding-bottom: 24px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: -24px;
    right: -24px;
    height: 1px;
    background-color: #242424;
  }

  @media (max-width: 1080px) {
    font-size: 16px;
    padding-bottom: 12px;

    &::after {
      left: -16px;
      right: -16px;
    }
  }
`;

const Personal = ({
  dictionary,
  profileData,
  isLoading,
}: {
  dictionary: any;
  profileData: User | null;
  isLoading: boolean;
}) => {
  const { updateProfile, isUpdating, updateError, updateSuccess, clearUpdateStatus } =
    useProfileUpdate();
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
  });

  const [originalData, setOriginalData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
  });

  // Update form data when profile data is loaded
  useEffect(() => {
    if (profileData) {
      const data = {
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        email: profileData.email || "",
        phone_number: profileData.phone_number || "",
        date_of_birth: profileData.date_of_birth || "",
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [profileData]);

  // Check if form has been modified
  const hasChanges = useMemo(() => {
    return (
      formData.first_name !== originalData.first_name ||
      formData.last_name !== originalData.last_name ||
      formData.phone_number !== originalData.phone_number ||
      formData.date_of_birth !== originalData.date_of_birth
    );
  }, [formData, originalData]);

  const handleInputChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear any previous error/success messages when user starts editing
    if (updateError || updateSuccess) {
      clearUpdateStatus();
    }
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    const updateData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number || undefined,
      date_of_birth: formData.date_of_birth || undefined,
    };

    const updatedUser = await updateProfile(updateData);

    if (updatedUser) {
      // Update AuthContext with new user data for immediate UI sync
      updateUser(updatedUser);

      // Update original data to reflect saved state
      const newData = {
        first_name: updatedUser.first_name || "",
        last_name: updatedUser.last_name || "",
        email: updatedUser.email || "",
        phone_number: updatedUser.phone_number || "",
        date_of_birth: updatedUser.date_of_birth || "",
      };
      setFormData(newData);
      setOriginalData(newData);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    clearUpdateStatus();
  };

  if (isLoading) {
    return (
      <StylePersonal>
        <Title>{dictionary?.profileBarTitle || "Personal information"}</Title>
        <div style={{ padding: "20px", textAlign: "center", color: "#777" }}>
          Loading profile data...
        </div>
      </StylePersonal>
    );
  }

  return (
    <StylePersonal>
      <Title>{dictionary?.profileBarTitle || "Personal information"}</Title>

      {/* Success/Error Messages */}
      {updateSuccess && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "5px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Profile updated successfully!
        </div>
      )}

      {updateError && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f44336",
            color: "white",
            borderRadius: "5px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {updateError}
        </div>
      )}

      <InputsWrapper>
        <LeftColumn>
          <InputWithLabel
            label={dictionary?.inputTitle1 || "Name"}
            placeholder={dictionary?.placeholder1 || "Name"}
            value={formData.first_name}
            onChange={handleInputChange("first_name")}
            gap={12}
          />
          <InputWithLabel
            icon="/assets/icons/Field Icon.svg"
            label={dictionary?.inputTitle3 || "Date of birth"}
            placeholder={dictionary?.placeholder3 || "Enter date"}
            value={formData.date_of_birth}
            onChange={handleInputChange("date_of_birth")}
            type="date"
          />
          <InputWithLabel
            icon="/assets/icons/gmail.svg"
            label={dictionary?.inputTitle5 || "Email"}
            placeholder={dictionary?.placeholder5 || "yourmail@gmail.com"}
            value={formData.email}
            onChange={handleInputChange("email")}
            type="email"
            readOnly
          />
        </LeftColumn>

        <RightColumn>
          <InputWithLabel
            label={dictionary?.inputTitle2 || "Last name"}
            placeholder={dictionary?.placeholder2 || "Last name"}
            value={formData.last_name}
            onChange={handleInputChange("last_name")}
            gap={12}
          />
          <InputWithLabel
            icon="/assets/icons/phone icon.svg"
            label={dictionary?.inputTitle4 || "Phone number"}
            placeholder={dictionary?.placeholder4 || "Enter phone number"}
            value={formData.phone_number}
            onChange={handleInputChange("phone_number")}
            type="tel"
          />
        </RightColumn>
      </InputsWrapper>

      <ButtonRow>
        <Cancel
          dictionary={dictionary}
          onCancel={handleCancel}
          disabled={!hasChanges || isUpdating}
        />
        <SaveButton
          dictionary={dictionary}
          onSave={handleSave}
          disabled={!hasChanges || isUpdating}
          isLoading={isUpdating}
        />
      </ButtonRow>
    </StylePersonal>
  );
};

export default Personal;
