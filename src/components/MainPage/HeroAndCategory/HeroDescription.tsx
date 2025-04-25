import React from "react";
import styled from "styled-components";

const StyledDescription = styled.p`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
  text-align: center;
  max-width: 620px;
  color: #fafafa;
  @media (max-width: 1080px) {
    font-size: 12px;
    line-height: 18px;
    max-width: 350px;
  }
`;

type Props = {
  text: string;
};

const HeroDescription = (props: Props) => {
  return <StyledDescription>{props.text}</StyledDescription>;
};

export default HeroDescription;
