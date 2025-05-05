"use client";
import React from "react";
import styled from "styled-components";
import Image from "next/image";
import ProductTitle from "../Header/ProductTitle";
import ProductPrice from "../Header/ProductPrice";
import PrimaryButton from "../Buttons/PrimaryButton";
import QuantitySelector from "../Header/QuantitySelector";

type Props = {
  card: "favorite" | "cart";
};

const StyledContainer = styled.div`
  width: 800px;
  height: 160px;
  display: flex;
  align-items: center;
  gap: 101px;
  background-color: #1a1a1a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  padding: 20px 0 20px 20px;
  border-radius: 17px;
  @media (max-width: 1080px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const StyledContent = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const StyledActions = styled.div`
  display: flex;
  align-items: center;
  gap: 78px;
`;

const StyledText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
`;

const FavoriteCard = ({ card }: Props) => {
  return (
    <StyledContainer>
      <StyledContent>
        <Image
          src={"/assets/ProductImageContainer.svg"}
          width={120}
          height={120}
          alt="product-image"
        />
        <StyledText>
          <ProductTitle text="ლურჯი ვარსკვლავის ჭაღი" size="large" />
          <ProductPrice text="199,99 ₾" size="large" />
        </StyledText>
      </StyledContent>

      <StyledActions>
        {card === "favorite" ? (
          <>
            <PrimaryButton height="55px" width="179px" text="დეტალურად" />
            <Image src={"/assets/RemoveProduct.svg"} width={34} height={34} alt="remove-icon" />
          </>
        ) : (
          <>
            <QuantitySelector size="large" />
            <Image src={"/assets/RemoveProduct.svg"} width={34} height={34} alt="remove-icon" />
          </>
        )}
      </StyledActions>
    </StyledContainer>
  );
};

export default FavoriteCard;
