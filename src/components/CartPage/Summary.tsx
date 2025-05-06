import React from "react";
import styled from "styled-components";
import ProductTitle from "../Header/ProductTitle";
import ProductPrice from "../Header/ProductPrice";
import PrimaryButton from "../Buttons/PrimaryButton";
import SummaryTitle from "./SummaryTitle";
import DividerLine from "../MainPage/HeroAndCategory/DividerLine";
import SummaryPrice from "./SummaryPrice";

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

type Props = {};

const Summary = (props: Props) => {
  return (
    <StyledContainer>
      <StyledSummary>
        <SummaryTitle text="ჯამი" />
        <SummaryPrice text="499,99 ₾" />
      </StyledSummary>
      <DividerLine variant="dark" />
      <StyledPrices>
        <StyledPrice>
          <ProductTitle text="პროდუქტის ღირებულება" size="large" />
          <ProductPrice text="499,99 ₾" size="normal" />
        </StyledPrice>
        <StyledPrice>
          <ProductTitle text="მიტანის სერვისი" size="large" />
          <ProductPrice text="14,99 ₾" size="normal" />
        </StyledPrice>{" "}
        <StyledPrice>
          <ProductTitle text="სერვისის საკომისიო" size="large" />
          <ProductPrice text="2,99 ₾" size="normal" />
        </StyledPrice>
      </StyledPrices>
      <DividerLine variant="dark" />
      <StyledButton>
        <PrimaryButton height="55px" width="432px" text="შეკვეთის გაფორმება" />
      </StyledButton>
    </StyledContainer>
  );
};

export default Summary;
