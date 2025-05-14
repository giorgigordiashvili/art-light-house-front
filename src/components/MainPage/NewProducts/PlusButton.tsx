import React from "react";
import styled from "styled-components";
import Image from "next/image";

const StyledButton = styled.button`
  width: 55px;
  height: 55px;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(92.9deg, #f7cb57 3.7%, #d8b146 97.98%);
  cursor: pointer;
  transition: 0.2s ease-in-out;
  @media (max-width: 1080px) {
    width: 40px;
    height: 40px;
  }

  &:hover {
    box-shadow: 0px 14px 32.8px -8px #f7cb576e;
  }
`;

const PlusButton = () => {
  return (
    <StyledButton>
      <Image src={"/assets/BlackPlus.svg"} width={28} height={28} alt="plus-icon" />
    </StyledButton>
  );
};

export default PlusButton;
