import React from "react";
import styled from "styled-components";
import PrimaryButton from "../Buttons/PrimaryButton";
import CartTitle from "../Cart/CartTitle";
import CartSubTitle from "../Cart/CartSubTitle";
import CartImage from "../Cart/CartImage";

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
    margin-top: 124px;
    height: auto;
  }
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 134px 0 136px 0;
  @media (max-width: 1080px) {
    padding: 0;
  }
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

const EmptyFavoritesCard = ({ dictionary }: any) => {
  return (
    <StyledContainer>
      <StyledContent>
        <CartImage image="favorite" />
        <StyledTitle>
          <CartTitle text={dictionary?.cart?.emptyFavorites?.subTitle || "Nothing saved"} />
        </StyledTitle>
        <StyledSubTitle>
          <CartSubTitle
            text={
              dictionary?.cart?.emptyFavorites?.description ||
              "See products and add your choice to cart"
            }
          />
        </StyledSubTitle>
        <StyledButton>
          <PrimaryButton
            text={dictionary?.cart?.emptyFavorites?.button || "Products"}
            width="205px"
            height="55px"
            media="no"
          />
        </StyledButton>
      </StyledContent>
    </StyledContainer>
  );
};

export default EmptyFavoritesCard;
