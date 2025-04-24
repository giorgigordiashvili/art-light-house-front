import React from "react";
import styled from "styled-components";
import Image from "next/image";

const StyledButton = styled.button`
  padding: 14px 20px 18px 29px;
  background-color: #ffcb40;
  box-shadow: 0px 14px 32.8px -8px #f7cb576e;
  border-radius: 142px;
  border: none;
  display: flex;
  align-items: center;
  gap: 25px;
  @media (max-width: 1080px) {
    gap: 17px;
    padding: 8px 16px 10px 17px;
  }
`;

const StyledButtonText = styled.p`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 18px;
  line-height: 28px;
  letter-spacing: 0%;
  color: #000000;
  @media (max-width: 1080px) {
    font-size: 14px;
  }
`;

type Props = {
  text: string;
};

const ViewPageButton = (props: Props) => {
  return (
    <StyledButton>
      <StyledButtonText>{props.text}</StyledButtonText>
      <Image src={"/assets/RightArrow.svg"} width={24} height={24} alt="arrow" />
    </StyledButton>
  );
};

export default ViewPageButton;
