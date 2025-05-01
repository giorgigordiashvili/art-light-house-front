"use client";
import styled from "styled-components";
import DetailBar from "@/components/DetailBar/DetailBar";
import Container from "@/components/Profile/Container";
import MobileDetailDropdown from "@/components/DetailBar/MobileDetailDropdown"; // დაამატე ეს!

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DesktopWrapper = styled.div`
  @media (max-width: 1080px) {
    display: none;
  }
`;

const MobileWrapper = styled.div`
  @media (min-width: 1081px) {
    display: none;
  }
`;

const MyDetails = () => {
  return (
    <StyledComponent>
      <DesktopWrapper>
        <DetailBar />
      </DesktopWrapper>

      <MobileWrapper>
        <MobileDetailDropdown />
      </MobileWrapper>

      <Container />
    </StyledComponent>
  );
};

export default MyDetails;
