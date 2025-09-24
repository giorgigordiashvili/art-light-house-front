"use client";
import React from "react";
import styled from "styled-components";
import PrimaryButton from "../Buttons/PrimaryButton";
import CartTitle from "./CartTitle";
import CartSubTitle from "./CartSubTitle";
import CartImage from "./CartImage";
import { usePathname, useRouter } from "next/navigation";

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
    height: auto;
    margin-top: 124px;
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

const EmptyCartCard = ({ dictionary }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const seg = (pathname?.split("/")[1] || "").toLowerCase();
  const locale = seg === "en" ? "en" : "ge";
  return (
    <StyledContainer>
      <StyledContent>
        <CartImage image="cart" />
        <StyledTitle>
          <CartTitle text={dictionary?.emptyCart?.subTitle || "Cart is empty"} />
        </StyledTitle>
        <StyledSubTitle>
          <CartSubTitle
            text={dictionary?.emptyCart?.description || "See products and add your choice to cart"}
          />
        </StyledSubTitle>
        <StyledButton>
          <PrimaryButton
            text={dictionary?.emptyCart?.button || "Products"}
            width="205px"
            height="55px"
            media="no"
            onClick={() => router.push(`/${locale}/products`)}
          />
        </StyledButton>
      </StyledContent>
    </StyledContainer>
  );
};

export default EmptyCartCard;
