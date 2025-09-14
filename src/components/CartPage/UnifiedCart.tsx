"use client";
import React from "react";
import styled from "styled-components";
<<<<<<< Updated upstream
import { useCart } from "../../contexts/CartContext";
=======
<<<<<<< HEAD
import { useCart } from "../../contexts/CartContext";
=======
import { useCart } from "@/contexts/CartContext";
>>>>>>> 696d478 (Delete clerk implementation from the project, Add login/registration using next-auth library)
>>>>>>> Stashed changes
import Cart from "./Cart";
import EmptyCartCard from "../Cart/EmptyCartCard";
import ContactTitle from "../Contact/ContactTitle";
import Container from "../ui/Container";
import BigCircle from "../ui/BigCircle";
import Circle from "../ui/Circle";
import LeftCircle from "../ui/LeftCircle";
import NewCircle from "../ui/NewCircle";

const StyledContainer = styled.div`
  width: 100%;
  position: relative;
  background-color: #0b0b0b;
  padding-bottom: 164px;
  padding-top: 186px;
  padding-inline: 20px;

  @media (max-width: 1080px) {
    padding: 157px 0 45px 0;
  }
`;

const StyledCircle = styled.div`
  position: absolute;
  left: 40%;
  transform: translateX(-50%);

  @media (max-width: 1080px) {
    top: 240px;
  }
  @media (max-width: 505px) {
    left: 30%;
  }
  @media (max-width: 409px) {
    left: 20%;
  }
  @media (max-width: 355px) {
    left: 10%;
  }
`;

const StyledEmptyCartContainer = styled.div`
  padding: 188px 20px 132px 20px;
  z-index: 1;
  @media (max-width: 1080px) {
    padding: 157px 0 222px 0;
  }
`;

interface UnifiedCartProps {
  dictionary: any;
}

const UnifiedCart: React.FC<UnifiedCartProps> = ({ dictionary }) => {
  const { cart, loading } = useCart();

  if (loading) {
    return (
      <StyledContainer>
        <BigCircle variant={2} />
        <StyledCircle>
          <Circle size="small" />
        </StyledCircle>
        <LeftCircle size="small" left="-140px" top="900px" media="yes" />
        <NewCircle size="small" right="142px" top="1000px" media="yes" />
        <Container>
          <StyledEmptyCartContainer>
            <ContactTitle text="Loading..." />
          </StyledEmptyCartContainer>
        </Container>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <BigCircle variant={2} />
      <StyledCircle>
        <Circle size="small" />
      </StyledCircle>
      <LeftCircle size="small" left="-140px" top="900px" media="yes" />
      <NewCircle size="small" right="142px" top="1000px" media="yes" />
      <Container>
<<<<<<< Updated upstream
        {cart.isEmpty ? (
=======
<<<<<<< HEAD
        {cart.isEmpty ? (
=======
        {cart.length === 0 ? (
>>>>>>> 696d478 (Delete clerk implementation from the project, Add login/registration using next-auth library)
>>>>>>> Stashed changes
          <StyledEmptyCartContainer>
            <ContactTitle text={dictionary?.cart?.title || "Cart"} />
            <EmptyCartCard dictionary={dictionary} />
          </StyledEmptyCartContainer>
        ) : (
          <Cart dictionary={dictionary} />
        )}
      </Container>
    </StyledContainer>
  );
};

export default UnifiedCart;
