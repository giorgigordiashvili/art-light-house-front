import React from "react";
import styled from "styled-components";
import GoogleMap from "./GoogleMap";
import Data from "./Data";
import GoogleMapButton from "./GoogleMapButton";

const OuterContainer = styled.div<{ side?: "left" | "right" }>`
  border-radius: 32px;
  width: 636px;
  z-index: 2;
  background: ${({ side }) =>
    side === "right"
      ? `linear-gradient(
          298.19deg,
          rgba(255, 255, 255, 0.03) 0%,
          rgba(253, 243, 218, 0.121183) 70.77%,
          rgba(246, 202, 86, 0.45) 98.36%
        )`
      : `linear-gradient(
          54.18deg,
          rgba(255, 255, 255, 0.03) 3.13%,
          rgba(253, 246, 225, 0.1043) 66.14%,
          rgba(246, 202, 86, 0.45) 100%
        )`};
  padding: 1px;
  box-sizing: border-box;

  @media (max-width: 1346px) {
    width: 100%;
  }

  @media (max-width: 1080px) {
    background: #262626 !important;
    border-radius: 18px;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 32px;
  padding: 12px 12px 5px 12px;
  background-color: #111110;
  width: 100%;
  @media (max-width: 1080px) {
    padding: 8px;
    border-radius: 17px;
  }
`;

const StyledData = styled.div`
  border-top: 1px solid #242424;
  margin-left: -12px;
  margin-right: -12px;
  padding-left: 12px;
  padding-right: 12px;
`;

const StyledAction = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  overflow: hidden;
`;

type Props = {
  side?: "left" | "right";
  dictionary?: any;
  location?: { lat: number; lng: number };
  branchData?: any;
  lang?: string;
};

const ContactCard = ({ side = "left", dictionary, location, branchData, lang = "ge" }: Props) => {
  const defaultPosition = { lat: 41.720542, lng: 44.764789 };
  const mapPosition = location ?? defaultPosition;

  // Map lang to API language key (ge -> ka)
  const apiLang = lang === "ge" ? "ka" : lang;
  const cityKey = apiLang === "en" ? "city_en" : "city_ka";
  const addressKey = apiLang === "en" ? "address_en" : "address_ka";

  // Get data from branchData or fallback to dictionary
  const city = branchData?.custom_data?.[cityKey] || dictionary.city;
  const address = branchData?.custom_data?.[addressKey] || dictionary.physicalAddress;
  const phoneNumber = branchData?.custom_data?.phone_number || dictionary.number;
  const workingHours = branchData?.custom_data?.working_hours || dictionary.hours;
  const googleMapsUrl = branchData?.custom_data?.google_maps_url || "";

  return (
    <OuterContainer side={side}>
      <StyledContainer>
        <GoogleMap dictionary={dictionary} location={mapPosition} />
        <StyledAction>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Data
              title={dictionary.address}
              data={city}
              image="address"
              secondData={address}
              withDivider
              boldData
            />
          </div>
          <GoogleMapButton text={dictionary.button} url={googleMapsUrl} />
        </StyledAction>
        <StyledData>
          <Data title={dictionary.phoneNumber} data={phoneNumber} image="phone" />
        </StyledData>
        <StyledData>
          <Data title={dictionary.workHours} data={workingHours} image="time" />
        </StyledData>
      </StyledContainer>
    </OuterContainer>
  );
};

export default ContactCard;
