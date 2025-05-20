import React from "react";
import styled, { css } from "styled-components";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const StyledContainer = styled.div<{ $displayMobile?: "none" | "visible" }>`
  border-radius: 31px;
  border: 1px solid #ffffff1a;
  padding: 9.5px 15px 9.5px 9px;
  display: flex;
  gap: 10px;
  align-items: center;
  height: 40px;
  margin-left: -12px;
  cursor: pointer;

  @media (max-width: 1080px) {
    display: ${(props) => props.$displayMobile || "flex"};
  }

  ${(props) =>
    props.$displayMobile === "none" &&
    css`
      @media (max-width: 1080px) {
        display: none;
      }
    `}
`;

const StyledCountryName = styled.p`
  font-family: Helvetica;
  font-weight: 500;
  font-size: 13px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #ffffff;
`;

type Props = {
  language?: "ka" | "en";
  display?: "none" | "visible";
};

const LanguageSwitcher = ({ language: propLanguage, display }: Props) => {
  const { language: contextLanguage } = useLanguage();
  const language = propLanguage || contextLanguage;
  const imageSource = language === "ka" ? "/assets/geo.svg" : "/assets/USA.png";
  const countryName = language === "ka" ? "GEO" : "ENG";

  const displayMobile = display === "none" ? "none" : undefined;

  return (
    <StyledContainer $displayMobile={displayMobile}>
      <Image src={imageSource} width={21} height={21} alt={`${countryName} flag`} />
      <StyledCountryName>{countryName}</StyledCountryName>
    </StyledContainer>
  );
};

export default LanguageSwitcher;
