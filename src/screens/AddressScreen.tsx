"use client";
import React from "react";
import styled from "styled-components";
import Container from "@/components/ui/Container";
import Address from "@/components/Address/Address";
import ContactTitle from "@/components/Contact/ContactTitle";

const StyledContainer = styled.div`
  padding-top: 186px;
  padding-bottom: 143px;
  background-color: #0b0b0b;
`;

const StyledAddress = styled.div`
  margin-top: 71px;
`;

const AddressScreen = () => {
  return (
    <StyledContainer>
      <Container>
        <ContactTitle text="ჩემი მისამართები" />
        <StyledAddress>
          <Address />
        </StyledAddress>
      </Container>
    </StyledContainer>
  );
};

export default AddressScreen;
