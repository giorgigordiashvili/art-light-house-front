"use client";
import styled from "styled-components";
import { useState } from "react";
import DeliveryMethod from "@/components/Checkout/DeliveryMethod";
import PaymentMethod from "@/components/Checkout/PaymentMethod";
import InputWithLabel from "@/components/Profile/Input";
const Container = styled.div`
  width: 100%;
  max-width: 1292px;

  @media (max-width: 1080px) {
    max-width: 100%;
    padding: 0 16px;
  }
`;

const DesktopWrapper = styled.div`
  padding: 20px;

  @media (max-width: 1080px) {
    display: none;
  }
`;

const MobileWrapper = styled.div`
  display: none;

  @media (max-width: 1080px) {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

const PageTitle = styled.h1`
  font-family: "Helvetica";
  font-weight: 250;
  font-size: 64px;
  line-height: 33.8px;
  color: white;
  margin-bottom: 71px;

  @media (max-width: 1080px) {
    font-size: 34px;
    line-height: 20px;
    margin-bottom: 67px;
    /* margin-top: 120px; */
    font-family: "Helvetica";
  }
`;

const DetailBarWrapper = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  margin-bottom: 20px;

  @media (min-width: 1081px) {
    display: none;
  }
`;

const Checkout = () => {
  const [isDropdownOpen] = useState(false);

  return (
    <Container>
      <DesktopWrapper>
        <PageTitle>შეკვეთის გაფორმება</PageTitle>
        <InputWithLabel
          icon="/assets/icons/phone icon.svg"
          label="ტელეფონი"
          placeholder="შეიყვანეთ ტელეფონის ნომერი"
        />
        {/* <DeliveryMethod /> */}
        <PaymentMethod />
      </DesktopWrapper>

      <MobileWrapper>
        <PageTitle>შეკვეთის გაფორმება</PageTitle>
        <DetailBarWrapper $isOpen={isDropdownOpen}></DetailBarWrapper>
      </MobileWrapper>
    </Container>
  );
};

export default Checkout;
