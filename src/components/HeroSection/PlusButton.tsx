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
`;

const PlusButton = () => {
  return (
    <StyledButton>
      <Image src={"/assets/BlackPlus.svg"} width={28} height={28} alt="plus-icon" />
    </StyledButton>
  );
};

export default PlusButton;
