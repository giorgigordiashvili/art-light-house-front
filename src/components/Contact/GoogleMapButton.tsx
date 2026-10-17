import React from "react";
import styled from "styled-components";
import GoogleMapLogo from "./GoogleMapLogo";

const StyledContainer = styled.a`
  padding: 8px 13px 8px 8px;
  border: 1px solid #242424;
  width: fit-content;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 41px;
  gap: 8px;
  width: 133px;
  text-decoration: none;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  @media (max-width: 1080px) {
    display: none;
  }
`;

const StyledText = styled.p`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 13px;
  line-height: 33.8px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #ffffff;
`;

type Props = {
  text: string;
  url?: string;
};

const GoogleMapButton = ({ text, url }: Props) => {
  const defaultUrl =
    "https://www.google.com/maps/place/art+light+house/@41.738805,44.7787057,622m/data=!3m2!1e3!4b1!4m6!3m5!1s0x40447294d400a6ef:0x5cb5a5a9dcbb867f!8m2!3d41.738801!4d44.7812806!16s%2Fg%2F11h9y5dypt";

  return (
    <StyledContainer href={url || defaultUrl} target="_blank" rel="noopener noreferrer">
      <GoogleMapLogo />
      <StyledText>{text}</StyledText>
    </StyledContainer>
  );
};

export default GoogleMapButton;
