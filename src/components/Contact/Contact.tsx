import React from "react";
import ContactCard from "./ContactCard";
import styled from "styled-components";
import ContactTitle from "./ContactTitle";
import Container from "../ui/Container";
import SectionTitle from "../MainPage/SectionTitle";
import type { HomepageSection } from "@/types/homepage";

const StyledContainer = styled.div`
  padding-inline: 20px;
  @media (max-width: 1080px) {
    padding-inline: 0;
  }
`;

const StyledContactCard = styled.div<{ $variant: "1" | "2" }>`
  display: flex;
  gap: 20px;
  margin-top: ${({ $variant }) => ($variant === "1" ? "89px" : "44px")};
  padding-bottom: ${({ $variant }) => ($variant === "2" ? "202px" : "0")};

  @media (max-width: 1080px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin-top: ${({ $variant }) => ($variant === "1" ? "44px" : "46px")};
    padding-bottom: ${({ $variant }) => ($variant === "1" ? "199px" : "108px")};
  }
`;

const StyledSectionTitle = styled.div`
  margin-top: 120px;
  @media (max-width: 1080px) {
    margin-top: 90px;
  }
`;

type ContactProps = {
  variant?: "1" | "2";
  dictionary?: any;
  homepageSections?: HomepageSection[];
  lang?: string;
};

const Contact: React.FC<ContactProps> = ({
  variant = "1",
  dictionary,
  homepageSections,
  lang = "ge",
}) => {
  // Map lang to API language key (ge -> ka)
  const apiLang = lang === "ge" ? "ka" : lang;

  // Extract branches section from API
  const branchesSection = homepageSections?.find(
    (section: HomepageSection) => section.section_type === "branches"
  );

  // Get section title
  const sectionTitle = branchesSection?.title?.[apiLang] || dictionary.title;

  // Get branches data
  const branches =
    branchesSection?.data
      ?.filter((item: any) => item.is_active)
      ?.sort((a: any, b: any) => a.position - b.position) || [];

  // Get left and right branches
  const leftBranch = branches.find((b: any) => b.custom_data?.position === "left") || branches[0];
  const rightBranch = branches.find((b: any) => b.custom_data?.position === "right") || branches[1];

  return (
    <StyledContainer>
      <Container>
        {variant === "1" && <ContactTitle text={dictionary.title2} />}
        {variant === "2" && (
          <StyledSectionTitle>
            <SectionTitle text={sectionTitle} image="address" />
          </StyledSectionTitle>
        )}
        <StyledContactCard $variant={variant}>
          {leftBranch && (
            <ContactCard
              side="left"
              dictionary={dictionary}
              location={{
                lat: leftBranch.custom_data?.latitude || 41.720542,
                lng: leftBranch.custom_data?.longitude || 44.764789,
              }}
              branchData={leftBranch}
              lang={lang}
            />
          )}
          {rightBranch && (
            <ContactCard
              side="right"
              dictionary={dictionary}
              location={{
                lat: rightBranch.custom_data?.latitude || 41.703998,
                lng: rightBranch.custom_data?.longitude || 44.791769,
              }}
              branchData={rightBranch}
              lang={lang}
            />
          )}
        </StyledContactCard>
      </Container>
    </StyledContainer>
  );
};

export default Contact;
