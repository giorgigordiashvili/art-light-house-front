import React from "react";
import styled from "styled-components";
import Image from "next/image";

const StyledContainer = styled.div`
  padding: 12px;
  border-radius: 50%;
  border: 1px solid #ffffff1a;
  width: 48px;
  height: 48px;
`;

const AddedAddressIcon = () => {
  return (
    <StyledContainer>
      <Image src={"/assets/briefcase.svg"} width={24} height={24} alt="added-icon" />
    </StyledContainer>
  );
};

export default AddedAddressIcon;
