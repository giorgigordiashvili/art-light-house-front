import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledName = styled.p`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;

  @media (max-width: 1080px) {
    font-size: 12px;
    line-height: 17.6px;
    max-width: 90px;
  }
`;

const StyledPrice = styled.p`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0%;
  color: #ffffff;
  @media (max-width: 1080px) {
    font-size: 15px;
    line-height: 17.6px;
  }
`;

type Props = {
  name: string;
  price: string;
};

const CardText = (props: Props) => {
  return (
    <StyledContainer>
      <StyledName>{props.name}</StyledName>
      <StyledPrice>{props.price}</StyledPrice>
    </StyledContainer>
  );
};

export default CardText;
