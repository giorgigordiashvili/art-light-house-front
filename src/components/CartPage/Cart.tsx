"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FavoriteCard from "../FavoritesPage/FavoriteCard";
import ContactTitle from "../Contact/ContactTitle";
import Summary from "./Summary";
import CartProduct from "../Header/CartProduct";

const StyledContainer = styled.div``;

const StyledCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 71px;
  max-height: 508px;
  overflow: scroll;
  scrollbar-width: none;
  @media (max-width: 1080px) {
    gap: 10px;
    max-height: 242px;
    margin-top: 48px;
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 31px;
  }
`;

const StyledSummary = styled.div`
  margin-top: 71px;
  @media (max-width: 1080px) {
    margin-top: 0;
  }
`;

type Props = {};

const Cart = (props: Props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1080);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <StyledContainer>
      <ContactTitle text="ჩემი პროდუქტები" />
      <StyledWrapper>
        <StyledCards>
          {!isMobile && (
            <>
              <FavoriteCard card="cart" />
              <FavoriteCard card="cart" />
              <FavoriteCard card="cart" />
              <FavoriteCard card="cart" />
            </>
          )}
          {isMobile && (
            <>
              <CartProduct />
              <CartProduct />
              <CartProduct />
              <CartProduct />
            </>
          )}
        </StyledCards>
        <StyledSummary>
          <Summary />
        </StyledSummary>
      </StyledWrapper>
    </StyledContainer>
  );
};

export default Cart;
