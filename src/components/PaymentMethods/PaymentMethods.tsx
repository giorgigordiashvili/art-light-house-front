"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DetailBar from "../DetailBar/DetailBar";
import PaymentMethodsBar from "./PaymentMethodsBar";
import MobileDetailDropdown from "../DetailBar/MobileDetailDropdown";
import ContactTitle from "../Contact/ContactTitle";
import Circle from "../ui/Circle";
import RightCircle from "../ui/RightCircle";
import LeftCircle from "../ui/LeftCircle";
import { PaymentMethodData } from "@/types";
import {
  ecommerceClientCardsRetrieve,
  ecommerceClientCardsDeleteDestroy,
  ecommerceClientCardsAddCreate,
} from "@/api/generated/api";

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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved cards from API
  const fetchSavedCards = async () => {
    try {
      setLoading(true);
      const response = await ecommerceClientCardsRetrieve();

      // Transform API response to PaymentMethodData format
      if (response && Array.isArray(response)) {
        const transformedCards: PaymentMethodData[] = response.map((card: any) => {
          // Normalize card type from API
          const cardTypeLower = card.card_type?.toLowerCase() || "";
          let cardType: "visa" | "mastercard" | "amex" = "visa";

          if (cardTypeLower.includes("mastercard") || cardTypeLower === "mc") {
            cardType = "mastercard";
          } else if (cardTypeLower.includes("amex") || cardTypeLower === "american express") {
            cardType = "amex";
          } else if (cardTypeLower.includes("visa")) {
            cardType = "visa";
          }

          return {
            id: card.id?.toString() || "",
            cardType,
            cardNumber: card.masked_card_number || "",
            cvv: "", // CVV not stored/returned from API
            expiry: card.card_expiry || "",
            lastFourDigits: card.masked_card_number?.slice(-4) || "",
          };
        });
        setPaymentMethods(transformedCards);
      }
    } catch (error) {
      console.error("Failed to fetch saved cards:", error);
      setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCards();
  }, []);

  // Handle adding a new card - redirects to BOG payment gateway
  const handleAddCard = async () => {
    try {
      const response: any = await ecommerceClientCardsAddCreate();

      if (response && response.payment_url) {
        // Redirect user to BOG payment gateway to add card
        window.location.href = response.payment_url;
      } else {
        console.error("No payment URL received from backend");
        alert(dictionary.addCardError || "Failed to initialize card addition. Please try again.");
      }
    } catch (error) {
      console.error("Failed to initiate card addition:", error);
      alert(dictionary.addCardError || "Failed to add card. Please try again.");
    }
  };

  // Handle card deletion
  const handleDeletePaymentMethod = async (paymentMethod: PaymentMethodData) => {
    if (!paymentMethod.id) return;

    try {
      await ecommerceClientCardsDeleteDestroy(parseInt(paymentMethod.id));
      // Refresh the cards list after successful deletion
      await fetchSavedCards();
    } catch (error) {
      console.error("Failed to delete card:", error);
      alert(dictionary.deleteCardError || "Failed to delete card. Please try again.");
    }
  };

  // Edit is not supported - user needs to delete and add new card
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEditPaymentMethod = (paymentMethod: PaymentMethodData) => {
    alert(
      dictionary.editCardNotSupported ||
        "To update card details, please delete this card and add a new one."
    );
  };

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
            onOpenModal={handleAddCard}
            paymentMethods={paymentMethods}
            onEditPaymentMethod={handleEditPaymentMethod}
            onDeletePaymentMethod={handleDeletePaymentMethod}
            dictionary={dictionary}
            loading={loading}
          />
        </StyledBars>
      </StyledContainer>
    </>
  );
};

export default PaymentMethods;
