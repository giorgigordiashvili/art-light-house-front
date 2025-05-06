import React from "react";
import styled from "styled-components";
import PrimaryButton from "../Buttons/PrimaryButton";
import CartTitle from "./CartTitle";
import CartSubTitle from "./CartSubTitle";
import CartImage from "./CartImage";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 540px;
  background-color: #1a1a1a96;
  border: 1px solid #ffffff12;
  border-radius: 17px;
  margin-top: 71px;
  @media (max-width: 1080px) {
    background-color: transparent;
    border: none;
  }
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 134px 0 136px 0;
`;

const StyledTitle = styled.div`
  margin-top: 29px;
`;

const StyledSubTitle = styled.div`
  margin-top: 9px;
`;

const StyledButton = styled.div`
  margin-top: 59px;
`;

const EmptyCartCard = () => {
  return (
    <StyledContainer>
      <StyledContent>
        <CartImage image="cart" />
        <StyledTitle>
          <CartTitle text="კალათა ცარიელია" />
        </StyledTitle>
        <StyledSubTitle>
          <CartSubTitle text="ნახე პროდუქტები და შენი არჩევანი დაამატე კალათაში" />
        </StyledSubTitle>
        <StyledButton>
          <PrimaryButton text="პროდუქტები" width="205px" height="55px" media="no" />
        </StyledButton>
      </StyledContent>
    </StyledContainer>
  );
};

export default EmptyCartCard;
