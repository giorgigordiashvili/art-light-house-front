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
    padding: 0 20px;
  }
`;

// Single tree for desktop and mobile so <Order> (and its request) is mounted once.
// DetailBar hides itself at <=1080px; the mobile dropdowns hide themselves on desktop.
const PageBody = styled.div`
  /* Keep 20px from the viewport edge once the 1292px content no longer fits */
  @media (max-width: 1332px) {
    padding-inline: 20px;
  }

  @media (max-width: 1080px) {
    padding-inline: 0;
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

  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 20px;

  @media (max-width: 1080px) {
    gap: 8px;
  }
`;

// On mobile the order list is only visible while the dropdown is open
const OrderSlot = styled.div<{ $open: boolean }>`
  @media (max-width: 1080px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
  }
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

const MyOrder = ({ dictionary }: any) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <StyledComponent>
      <Container>
        <PageBody>
          <PageTitle>{dictionary?.title || "My Orders"}</PageTitle>
          <MobileDetailDropdown dictionary={dictionary} />
          <ContentWrapper>
            <DetailBar dictionary={dictionary} />
            <RightSection>
              <MobileOrderDropdown
                dictionary={dictionary}
                open={isMobileOpen}
                onToggle={() => setIsMobileOpen((prev) => !prev)}
              />
              <OrderSlot $open={isMobileOpen}>
                <Order dictionary={dictionary} />
              </OrderSlot>
            </RightSection>
          </ContentWrapper>
        </PageBody>
      </Container>
    </StyledComponent>
  );
};

export default MyOrder;
