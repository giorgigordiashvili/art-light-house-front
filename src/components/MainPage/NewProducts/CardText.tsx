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
`;

const StyledPrice = styled.p`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0%;
  color: #ffffff;
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
