"use client";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Image from "next/image";
import ProductTitle from "../Header/ProductTitle";
import ProductPrice from "../Header/ProductPrice";
import PrimaryButton from "../Buttons/PrimaryButton";
import QuantitySelector from "../Header/QuantitySelector";
import CompactButton from "../Buttons/CompactButton";

type Props = {
  card: "favorite" | "cart";
};

const StyledContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "cardType",
})<{ cardType: "favorite" | "cart" }>`
  position: relative;
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  gap: ${({ cardType }) => (cardType === "cart" ? "130px" : "20px")};
  background-color: #1a1a1a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  padding: ${({ cardType }) => (cardType === "cart" ? "20px 46px 20px 20px" : "20px")};
  border-radius: 17px;

  @media (max-width: 1332px) {
    padding: ${({ cardType }) => (cardType === "cart" ? "20px 46px 20px 20px" : "14px")};
  }

  @media (max-width: 1250px) {
    gap: ${({ cardType }) => (cardType === "cart" ? "90px" : "16px")};
  }

  @media (max-width: 1080px) {
    width: 100%;
    justify-content: space-between;
    display: block;
    height: auto;
    padding: 15px;

    ${({ cardType }) =>
      cardType === "favorite" &&
      css`
        align-items: initial;
      `}
  }
`;

const StyledContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "cardType",
})<{ cardType: "favorite" | "cart" }>`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 1332px) {
    gap: 12px;
  }

  @media (max-width: 1080px) {
    gap: 12px;
    ${({ cardType }) =>
      cardType === "favorite" &&
      css`
        img {
          width: 54px !important;
          height: 54px !important;
        }
      `}
  }
`;

const StyledActions = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "cardType",
})<{ cardType: "favorite" | "cart" }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ cardType }) => (cardType === "cart" ? "99px" : "20px")};

  @media (max-width: 1250px) {
    gap: ${({ cardType }) => (cardType === "cart" ? "70px" : "16px")};
  }
`;

const StyledText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;

  @media (max-width: 1220px) {
    max-width: 140px;
  }

  @media (max-width: 1140px) {
    max-width: 120px;
  }

  @media (max-width: 1080px) {
    gap: 6px;
    max-width: 100%;
  }
`;

const StyledRemoveIconWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "cardType",
})<{ cardType: "favorite" | "cart" }>`
  ${({ cardType }) =>
    cardType === "favorite" &&
    css`
      cursor: pointer;
      @media (max-width: 1080px) {
        position: absolute;
        top: 18px;
        right: 18px;
      }
    `}
`;

const FavoriteCard = ({ card }: Props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1080);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <StyledContainer cardType={card}>
      <StyledContent cardType={card}>
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

      <StyledActions cardType={card}>
        {card === "favorite" ? (
          <>
            {isMobile ? (
              <CompactButton text="დეტალურად" />
            ) : (
              <PrimaryButton height="55px" width="179px" text="დეტალურად" media="no" card={true} />
            )}
            <StyledRemoveIconWrapper cardType={card}>
              <Image src={"/assets/RemoveProduct.svg"} width={34} height={34} alt="remove-icon" />
            </StyledRemoveIconWrapper>
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
