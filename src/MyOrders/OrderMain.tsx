"use client";
import styled from "styled-components";
import { useState } from "react";
import DetailBar from "@/components/DetailBar/DetailBar";
import MobileDetailDropdown from "@/components/DetailBar/MobileDetailDropdown";
import MobileOrderDropdown from "./MobileOrderDropDown";
import Order from "@/MyOrders/Order";

const StyledComponent = styled.div`
  background: #0b0b0b;
  margin-top: 80px;
  margin-bottom: 219px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 24px;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 20px;
`;

const PageTitle = styled.h1`
  font-family: "Helvetica";
  font-weight: 250;
  font-size: 64px;
  line-height: 33.8px;
  color: white;
  margin-top: 106px;
  margin-bottom: 71px;
  position: relative;
  z-index: 1;

  @media (max-width: 1080px) {
    font-size: 34px;
    line-height: 24px;
    margin-bottom: 20px;
    margin-top: 120px;
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

const MyOrder = ({ dictionary }: any) => {
  const [isDropdownOpen] = useState(false);

  return (
    <StyledComponent>
      <Container>
        {/* Desktop */}
        <DesktopWrapper>
          <PageTitle>{dictionary?.title || "My Orders"}</PageTitle>
          <ContentWrapper>
            <DetailBar dictionary={dictionary} />
            <RightSection>
              <Order dictionary={dictionary} />
            </RightSection>
          </ContentWrapper>
        </DesktopWrapper>

        {/* Mobile */}
        <MobileWrapper>
          <PageTitle>{dictionary?.title || "My Orders"}</PageTitle>
          <MobileDetailDropdown dictionary={dictionary} />
          <MobileOrderDropdown dictionary={dictionary} />
          <DetailBarWrapper $isOpen={isDropdownOpen}>
            <DetailBar dictionary={dictionary} />
          </DetailBarWrapper>
        </MobileWrapper>
      </Container>
    </StyledComponent>
  );
};

export default MyOrder;
