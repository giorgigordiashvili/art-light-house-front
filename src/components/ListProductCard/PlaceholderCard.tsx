import React from "react";
import styled from "styled-components";

const StyledRectangle = styled.div`
  width: 308px;
  height: 417px;
  border-radius: 17px;
  z-index: 2;
  opacity: 0.3;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 1080px) {
    width: 100%;
    height: 300px;
  }
`;

const PlaceholderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0.2;
`;

const PlaceholderImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: #ffffff10;

  @media (max-width: 1080px) {
    width: 60px;
    height: 60px;
  }
`;

const PlaceholderText = styled.div`
  width: 120px;
  height: 8px;
  border-radius: 4px;
  background: #ffffff08;
  margin-bottom: 5px;
`;

const PlaceholderPrice = styled.div`
  width: 80px;
  height: 8px;
  border-radius: 4px;
  background: #ffffff08;
`;

const PlaceholderCard = () => {
  return (
    <StyledRectangle>
      <PlaceholderContent>
        <PlaceholderImage />
        <PlaceholderText />
        <PlaceholderPrice />
      </PlaceholderContent>
    </StyledRectangle>
  );
};

export default PlaceholderCard;
