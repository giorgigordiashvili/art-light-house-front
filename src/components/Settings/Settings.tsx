"use client";
import styled from "styled-components";
import DetailBar from "@/components/DetailBar/DetailBar";
import Pass from "./Pass";
import MobileDetailDropdown from "@/components/DetailBar/MobileDetailDropdown";

const StyledComponent = styled.div`
  /* Transparent so the screen's BigCircle background shows through */
  background: transparent;
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

// Single tree for desktop and mobile so the form (and its state) is mounted once.
// DetailBar hides itself at <=1080px and MobileDetailDropdown hides itself on desktop.
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
  /* width: 100%; */
`;

const PageTitle = styled.h1`
  font-family: "Helvetica";
  font-weight: 250;
  font-size: 64px;
  line-height: 33.8px;
  color: white;
  margin-top: 106px;
  margin-bottom: 71px;

  @media (max-width: 1080px) {
    font-size: 34px;
    line-height: 24px;
    margin-bottom: 20px;
    margin-top: 120px;
    font-family: "Helvetica";
  }
`;

const Settings = ({ dictionary }: any) => {
  return (
    <StyledComponent>
      <Container>
        <PageBody>
          <PageTitle>{dictionary?.title1}</PageTitle>
          <MobileDetailDropdown dictionary={dictionary} />
          <ContentWrapper>
            <DetailBar dictionary={dictionary} />
            <RightSection>
              <Pass dictionary={dictionary} />
            </RightSection>
          </ContentWrapper>
        </PageBody>
      </Container>
    </StyledComponent>
  );
};

export default Settings;
