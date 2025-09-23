import React from "react";
import styled from "styled-components";
import Image from "next/image";

const StyledComponent = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;

  @media (max-width: 1080px) {
    top: 10px;
    right: 10px;
  }
`;

const HeartIcon = () => {
  return (
    <StyledComponent>
      <Image src="/assets/icons/heart.png" alt="heart" width={24} height={24} />
    </StyledComponent>
  );
};

export default HeartIcon;
