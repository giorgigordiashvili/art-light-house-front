"use client";
import React from "react";
import styled from "styled-components";

const StyledContainer = styled.h1`
  position: relative;
  z-index: 2;
  font-family: Helvetica;
  font-weight: 250;
  font-size: 64px;
  line-height: 33.8px;
  letter-spacing: 0%;
  color: #ffffff;

  @media (max-width: 1080px) {
    font-size: 34px;
    line-height: 24px;
  }

  @media (max-width: 420px) {
    font-size: 27px;
  }
`;

type Props = {
  text: string;
};

const ContactTitle = (props: Props) => {
  return <StyledContainer>{props.text}</StyledContainer>;
};

export default ContactTitle;
