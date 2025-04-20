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
};

const GoogleMapButton = (props: Props) => {
  return (
    <StyledContainer
      href="https://www.google.com/maps/place/41%C2%B043'14.0%22N+44%C2%B045'53.2%22E/@41.720542,44.764789,17z/data=!3m1!4b1!4m4!3m3!8m2!3d41.720542!4d44.764789?entry=ttu&g_ep=EgoyMDI1MDQxNi4xIKXMDSoASAFQAw%3D%3D"
      target="_blank"
      rel="noopener noreferrer"
    >
      <GoogleMapLogo />
      <StyledText>{props.text}</StyledText>
    </StyledContainer>
  );
};

export default GoogleMapButton;
