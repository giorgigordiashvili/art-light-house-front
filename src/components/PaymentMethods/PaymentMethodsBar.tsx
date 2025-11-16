import React, { FC } from "react";
import styled from "styled-components";
import AddedPaymentMethodCard from "./AddedPaymentMethodCard";
import PaymentMethodCard from "./PaymentMethodCard";
import PaymentMethodTitle from "./PaymentMethodTitle";
import DividerLine from "../MainPage/HeroAndCategory/DividerLine";
import { PaymentMethodData } from "@/types";

const StyledContainer = styled.div`
  background-color: #1a1a1a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  border-radius: 17px;
  width: 800px;
  height: 544px;
  z-index: 1;
  @media (max-width: 1080px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  padding: 22px 24px 59px 24px;
  max-height: 363px;
  width: 800px;
  scrollbar-width: none;
  overflow: scroll;
  @media (max-width: 1080px) {
    display: flex;
    flex-direction: column;
    padding: 22px 16px 24px 16px;
    width: auto;
  }
`;

const SkeletonCard = styled.div`
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 10px;
  height: 100px;
  width: 367px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (max-width: 1080px) {
    width: 100%;
    height: 111px;
  }
`;

type Props = {
  onOpenModal: () => void;
  paymentMethods: PaymentMethodData[];
  onEditPaymentMethod: (paymentMethod: PaymentMethodData) => void;
  onDeletePaymentMethod: (paymentMethod: PaymentMethodData) => void;
  dictionary: any;
  loading?: boolean;
};

export const PaymentMethodsBar: FC<Props> = ({
  onOpenModal,
  paymentMethods,
  onEditPaymentMethod,
  onDeletePaymentMethod,
  dictionary,
  loading = false,
}) => {
  return (
    <StyledContainer>
      <PaymentMethodTitle text={dictionary.paymentBarTitle} />
      <DividerLine />
      <StyledCardsWrapper>
        <PaymentMethodCard onOpenModal={onOpenModal} dictionary={dictionary} />
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          paymentMethods.map((item) => (
            <AddedPaymentMethodCard
              key={item.id}
              data={item}
              onEditPaymentMethod={() => onEditPaymentMethod(item)}
              onDeletePaymentMethod={() => onDeletePaymentMethod(item)}
              dictionary={dictionary}
            />
          ))
        )}
      </StyledCardsWrapper>
    </StyledContainer>
  );
};

export default PaymentMethodsBar;
