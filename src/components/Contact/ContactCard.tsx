import React from "react";
import styled, { css } from "styled-components";
import GoogleMap from "./GoogleMap";
import Data from "./Data";
import GoogleMapButton from "./GoogleMapButton";

const OuterContainer = styled.div<{ side?: "left" | "right" }>`
  padding: 2px;
  border-radius: 24px;
  width: fit-content;

  ${({ side }) =>
    side === "right"
      ? css`
          background: linear-gradient(
            298.19deg,
            rgba(255, 255, 255, 0.03) 0%,
            rgba(253, 243, 218, 0.121183) 70.77%,
            rgba(246, 202, 86, 0.45) 98.36%
          );
        `
      : css`
          background: linear-gradient(
            54.18deg,
            rgba(255, 255, 255, 0.03) 3.13%,
            rgba(253, 246, 225, 0.1043) 66.14%,
            rgba(246, 202, 86, 0.45) 100%
          );
        `}

  @media (max-width: 1346px) {
    width: 100%;
  }

  @media (max-width: 1080px) {
    background: #262626 !important;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 22px;
  background-color: #111110;
  @media (max-width: 1080px) {
    padding: 8px;
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
};

const ContactCard = ({ side = "left" }: Props) => {
  return (
    <OuterContainer side={side}>
      <StyledContainer>
        <GoogleMap />
        <StyledAction>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Data
              title="მისამართი"
              data="თბილისი"
              image="address"
              secondData="ბახტრიონის N23"
              withDivider
              boldData
            />
          </div>
          <GoogleMapButton text="Google Maps" />
        </StyledAction>
        <StyledData>
          <Data title="ტელეფონის ნომერი" data="(+995) 577 45 55 55" image="phone" />
        </StyledData>
        <StyledData>
          <Data title="სამუშაო საათები" data="10:00 - 21:00" image="time" />
        </StyledData>
      </StyledContainer>
    </OuterContainer>
  );
};

export default ContactCard;
