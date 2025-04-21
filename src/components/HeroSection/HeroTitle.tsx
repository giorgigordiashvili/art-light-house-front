import React from "react";
import styled from "styled-components";

const StyledContainer = styled.h1`
  font-family: Helvetica;
  font-weight: 250;
  font-size: 84px;
  line-height: 86px;
  letter-spacing: -1.2%;
  text-align: center;
  color: #fafafa;
`;

const StyledSpan = styled.span`
  color: #ffcb40;
`;

type Props = {
  lightText: string;
  text: string;
};

const HeroTitle = (props: Props) => {
  return (
    <StyledContainer>
      <StyledSpan>{props.lightText}</StyledSpan>
      {props.text}
    </StyledContainer>
  );
};

export default HeroTitle;
