"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DetailBar from "../DetailBar/DetailBar";
import PaymentMethodsBar from "./PaymentMethodsBar";
import PaymentMethodModal from "./PaymentMethodModal/PaymentMethodModal";
import MobileDetailDropdown from "../DetailBar/MobileDetailDropdown";
import ContactTitle from "../Contact/ContactTitle";
import Circle from "../ui/Circle";
import RightCircle from "../ui/RightCircle";
import LeftCircle from "../ui/LeftCircle";
import { PaymentMethodData } from "@/types";

const StyledContainer = styled.div`
  position: relative;
  z-index: 1;
  @media (max-width: 1332px) {
    padding-inline: 20px;
  }
  @media (max-width: 1080px) {
    padding-inline: 0;
  }
`;

const StyledCircle = styled.div`
  position: absolute;
  left: 43%;
  top: 0;
  @media (max-width: 1080px) {
    display: none;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000000cc;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledModal = styled.div`
  @media (max-width: 1080px) {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
`;

const StyledBars = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 71px;
  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 19px;
    margin-top: 41px;
  }
`;

const StyledMobileDetail = styled.div`
  display: none;
  @media (max-width: 1080px) {
    display: flex;
  }
`;

const PaymentMethods = ({ dictionary }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethodData | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);

  const handleSavePaymentMethod = (paymentMethod: PaymentMethodData) => {
    if (editingPaymentMethod) {
      // Update existing payment method
      setPaymentMethods((prev) =>
        prev.map((pm) => (pm.id === paymentMethod.id ? paymentMethod : pm))
      );
    } else {
      // Add new payment method
      setPaymentMethods((prev) => [...prev, { ...paymentMethod, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setEditingPaymentMethod(null);
  };

  const handleEditPaymentMethod = (paymentMethod: PaymentMethodData) => {
    setEditingPaymentMethod(paymentMethod);
  };

  const handleDeletePaymentMethod = (paymentMethod: PaymentMethodData) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== paymentMethod.id));
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen || editingPaymentMethod ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, editingPaymentMethod]);

  return (
    <>
      <StyledContainer>
        <StyledCircle>
          <Circle size="small" />
        </StyledCircle>
        <RightCircle size="small" top="830px" right="-150px" media="yes" />
        <LeftCircle size="small" top="750px" left="-255px" media="yes" />
        <div>
          <ContactTitle text={dictionary.title} />
        </div>
        <StyledBars>
          <DetailBar dictionary={dictionary} />
          <StyledMobileDetail>
            <MobileDetailDropdown dictionary={dictionary} />
          </StyledMobileDetail>
          <PaymentMethodsBar
            onOpenModal={() => setIsModalOpen(true)}
            paymentMethods={paymentMethods}
            onEditPaymentMethod={handleEditPaymentMethod}
            onDeletePaymentMethod={handleDeletePaymentMethod}
            dictionary={dictionary}
          />
        </StyledBars>
      </StyledContainer>

      {(isModalOpen || editingPaymentMethod) && (
        <Overlay
          onClick={() => {
            setIsModalOpen(false);
            setEditingPaymentMethod(null);
          }}
        >
          <StyledModal onClick={(e) => e.stopPropagation()}>
            <PaymentMethodModal
              onClose={() => {
                setIsModalOpen(false);
                setEditingPaymentMethod(null);
              }}
              onSave={handleSavePaymentMethod}
              initialData={editingPaymentMethod || undefined}
              dictionary={dictionary}
            />
          </StyledModal>
        </Overlay>
      )}
    </>
  );
};

export default PaymentMethods;
