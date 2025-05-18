"use client";
import React from "react";
import styled from "styled-components";
import Container from "@/components/ui/Container";
import Address from "@/components/Address/Address";
import BigCircle from "@/components/ui/BigCircle";

const StyledContainer = styled.div`
  padding-top: 186px;
  padding-bottom: 143px;
  background-color: #0b0b0b;
  overflow-x: visible;
  @media (max-width: 1080px) {
    padding-top: 157px;
    padding-bottom: 68px;
  }
`;

const StyledAddress = styled.div``;

const AddressScreen = () => {
  return (
    <StyledContainer>
      <BigCircle variant={2} />
      <Container>
        <StyledAddress>
          <Address />
        </StyledAddress>
      </Container>
    </StyledContainer>
  );
};

export default AddressScreen;
