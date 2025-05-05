"use client";
import styled from "styled-components";
import DetailBar from "@/components/DetailBar/DetailBar";
import Container from "@/components/Profile/PersonalInf";
import Pass from "@/components/Profile/Pass";
import MobileDetailDropdown from "@/components/DetailBar/MobileDetailDropdown";

const StyledComponent = styled.div`
  background: black;
  margin-top: 80px;
  margin-bottom: 219px;

  @media (max-width: 1080px) {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
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
  font-family: "Helvetica Neue LT GEO";
  font-weight: 250;
  font-size: 64px;
  line-height: 33.8px;
  color: white;
  margin-top: 186px;
  margin-bottom: 71px;

  @media (max-width: 1080px) {
    font-size: 34px;
    line-height: 24px;
    margin-bottom: 47px;
  }
`;

const MyDetails = () => {
  return (
    <StyledComponent>
      <DesktopWrapper>
        <PageTitle>ჩემი პროფილი</PageTitle>
        <ContentWrapper>
          <DetailBar />
          <RightSection>
            <Container />
            <Pass />
          </RightSection>
        </ContentWrapper>
      </DesktopWrapper>

      <MobileWrapper>
        <MobileDetailDropdown />
      </MobileWrapper>
    </StyledComponent>
  );
};

export default MyDetails;
