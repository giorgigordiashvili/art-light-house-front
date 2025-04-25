import React from "react";
import Image from "next/image";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 50px;
  padding: 13px;
  border: 1px solid #ffffff12;
  border-radius: 50%;
  backdrop-filter: blur(114px);
  color: #1a1a1a96;
  cursor: pointer;
`;

const RightSlide = () => {
  return (
    <StyledContainer>
      <Image src={"/assets/RightSlideIcon.svg"} width={24} height={24} alt="right slide" />
    </StyledContainer>
  );
};

export default RightSlide;
