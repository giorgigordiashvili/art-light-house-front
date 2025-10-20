"use client";
import React from "react";
import styled from "styled-components";
import { useRouter, usePathname } from "next/navigation";
import ProductTitle from "../Header/ProductTitle";
import ProductPrice from "../Header/ProductPrice";
import PrimaryButton from "../Buttons/PrimaryButton";
import SummaryTitle from "./SummaryTitle";
import DividerLine from "../MainPage/HeroAndCategory/DividerLine";
import SummaryPrice from "./SummaryPrice";
import type { Cart } from "@/api/generated/interfaces";

const StyledContainer = styled.div`
  background-color: #1a1a1a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  border-radius: 17px;
  width: 472px;
  height: 353px;
  @media (max-width: 1080px) {
    width: 100%;
  }
`;

const StyledSummary = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 25px 22px 26px 21px;
`;

const StyledPrices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 23px;
  padding-top: 18px;
  padding-bottom: 47px;
`;

const StyledPrice = styled.div`
  display: flex;
  justify-content: space-between;
  padding-inline: 20px;
`;

const StyledButton = styled.div`
  padding: 20px;
`;

interface SummaryProps {
  dictionary: any;
  cart?: Cart | null;
  onPayment?: () => void;
  submitting?: boolean;
}

const Summary = ({ dictionary, cart, onPayment, submitting }: SummaryProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const isCheckoutPage = pathname.includes("/checkout");

  // Calculate totals
  const subtotal = cart?.total_price ? parseFloat(cart.total_price) : 0;
  const deliveryFee = 10.0; // Fixed delivery fee for now
  const serviceFee = 0.0; // No service fee
  const total = subtotal + deliveryFee + serviceFee;

  const handleCheckout = (e?: React.MouseEvent) => {
    if (isCheckoutPage && onPayment) {
      // On checkout page, trigger payment
      onPayment();
    } else {
      // On cart page, navigate to checkout
      if (e && (e.ctrlKey || e.metaKey)) {
        window.open(`/${locale}/checkout`, "_blank");
      } else {
        router.push(`/${locale}/checkout`);
      }
    }
  };

  const handleCheckoutMouseDown = (e: React.MouseEvent) => {
    if (!isCheckoutPage) {
      if (e.button === 1) {
        e.preventDefault();
        window.open(`/${locale}/checkout`, "_blank");
      }
    }
  };

  const buttonText = isCheckoutPage
    ? dictionary?.paymentButton || "გადახდა"
    : dictionary?.button2 || "შეკვეთის გაფორმება";

  return (
    <StyledContainer>
      <StyledSummary>
        <SummaryTitle text={dictionary?.summary || "შეჯამება"} />
        <SummaryPrice text={`${total.toFixed(2)} ₾`} />
      </StyledSummary>
      <DividerLine variant="dark" />
      <StyledPrices>
        <StyledPrice>
          <ProductTitle text={dictionary?.productPrice || "პროდუქტის ღირებულება"} size="large" />
          <ProductPrice text={`${subtotal.toFixed(2)} ₾`} size="normal" />
        </StyledPrice>
        <StyledPrice>
          <ProductTitle text={dictionary?.deliveryService || "მიტანის სერვისი"} size="large" />
          <ProductPrice text={`${deliveryFee.toFixed(2)} ₾`} size="normal" />
        </StyledPrice>
        {serviceFee > 0 && (
          <StyledPrice>
            <ProductTitle
              text={dictionary?.serviceCommision || "სერვისის საკომისიო"}
              size="large"
            />
            <ProductPrice text={`${serviceFee.toFixed(2)} ₾`} size="normal" />
          </StyledPrice>
        )}
      </StyledPrices>
      <DividerLine variant="dark" />
      <StyledButton onClick={handleCheckout} onMouseDown={handleCheckoutMouseDown}>
        <PrimaryButton
          height="55px"
          width="432px"
          text={submitting ? "დაელოდეთ..." : buttonText}
          disabled={submitting}
        />
      </StyledButton>
    </StyledContainer>
  );
};

export default Summary;
