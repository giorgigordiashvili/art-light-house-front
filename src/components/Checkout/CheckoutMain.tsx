"use client";
import styled from "styled-components";
import { useState } from "react";
import CheckoutCard from "@/components/Checkout/CheckoutCard";
import DeliveryOptionCard from "@/components/Checkout/DeliveryOptionCard";
import InputWithLabel from "@/components/Profile/Input";
import TextContainer from "@/components/Checkout/TextContainer";
import Summery from "@/components/CartPage/Summary";

const Container = styled.div`
  width: 100%;
  max-width: 1292px;

  @media (max-width: 1080px) {
    max-width: 100%;
    padding: 0 16px;
  }
`;

const DesktopWrapper = styled.div`
  padding: 20px;

  @media (max-width: 1080px) {
    display: none;
  }
`;

const MobileWrapper = styled.div`
  display: none;

  @media (max-width: 1080px) {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
`;

const PageTitle = styled.h1`
  font-family: "Helvetica";
  font-weight: 250;
  font-size: 64px;
  line-height: 33.8px;
  color: white;
  margin-bottom: 36px;

  @media (max-width: 1080px) {
    font-size: 34px;
    line-height: 20px;
    margin-bottom: 32px;
  }
`;

const Label = styled.p`
  font-family: Helvetica;
  font-weight: 500;
  font-size: 18px;
  line-height: 33.8px;
  color: #ffffff;
  margin-top: 38px;
  margin-bottom: 18px;
  @media (max-width: 1080px) {
    margin-top: 34px;
    font-size: 16px;
  }
`;

const CardsWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 38px;

  @media (max-width: 1080px) {
    flex-direction: column;
  }
`;

const CheckoutContent = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;

  @media (max-width: 1080px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RightSection = styled.div`
  width: 100%;
  max-width: 472px;
  margin-top: 25px;
  @media (max-width: 1080px) {
    margin-top: 34px;
  }
`;

const Checkout = () => {
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);

  const toggleDelivery = (method: string) => {
    if (selectedDelivery === method) {
      setSelectedDelivery(null);
    } else {
      setSelectedDelivery(method);
    }
  };

  return (
    <Container>
      <DesktopWrapper>
        <PageTitle>შეკვეთის გაფორმება</PageTitle>

        <CheckoutContent>
          <LeftSection>
            <CheckoutCard
              label="მისამართი"
              method="სამსახური"
              desc="5 Petre Kavtaradze Street"
              imageSrc="/assets/icons/job.svg"
            />

            <CheckoutCard
              label="გადახდის მეთოდი"
              method="ბარათი"
              desc="ტრანზაქციის შემდეგ თქვენი ბარათის მონაცემები შეინახება ბანკის დაცულ სერვერზე"
              imageSrc="/assets/icons/gadaxda.svg"
            />
          </LeftSection>

          <RightSection>
            <Summery />
          </RightSection>
        </CheckoutContent>

        <Label>მიწოდება</Label>
        <CardsWrapper>
          <DeliveryOptionCard
            method="ექსპრეს მოტანა"
            desc="40 წუთიდან 2 საათამდე"
            imageSrc="/assets/Delivery Icon.svg"
            selected={selectedDelivery === "ექსპრეს მოტანა"}
            disabled={selectedDelivery !== null && selectedDelivery !== "ექსპრეს მოტანა"}
            onSelect={() => toggleDelivery("ექსპრეს მოტანა")}
          />
          <DeliveryOptionCard
            method="შემდეგ დღეს მოტანა"
            desc="10:00 - დან 13:00 საათამდე"
            imageSrc="/assets/icons/IconDate.svg"
            selected={selectedDelivery === "შემდეგ დღეს მოტანა"}
            disabled={selectedDelivery !== null && selectedDelivery !== "შემდეგ დღეს მოტანა"}
            onSelect={() => toggleDelivery("შემდეგ დღეს მოტანა")}
          />
        </CardsWrapper>

        <InputWithLabel
          icon="/assets/icons/phone icon.svg"
          label="ტელეფონი"
          placeholder="შეიყვანეთ ტელეფონის ნომერი"
          gap={18}
        />

        <Label>დამატებითი ინფორმაცია</Label>
        <TextContainer placeholder="დამატებითი ინფორმაცია" />
      </DesktopWrapper>

      <MobileWrapper>
        <PageTitle>შეკვეთის გაფორმება</PageTitle>

        <CheckoutCard
          label="მისამართი"
          method="სამსახური"
          desc="5 Petre Kavtaradze Street"
          imageSrc="/assets/icons/job.svg"
        />

        <CheckoutCard
          label="გადახდის მეთოდი"
          method="ბარათი"
          desc="ტრანზაქციის შემდეგ თქვენი ბარათის მონაცემები შეინახება ბანკის დაცულ სერვერზე"
          imageSrc="/assets/icons/gadaxda.svg"
        />

        <RightSection>
          <Summery />
        </RightSection>

        <Label>მიწოდება</Label>
        <CardsWrapper>
          <DeliveryOptionCard
            method="ექსპრეს მოტანა"
            desc="40 წუთიდან 2 საათამდე"
            imageSrc="/assets/Delivery Icon.svg"
            selected={selectedDelivery === "ექსპრეს მოტანა"}
            disabled={selectedDelivery !== null && selectedDelivery !== "ექსპრეს მოტანა"}
            onSelect={() => toggleDelivery("ექსპრეს მოტანა")}
          />
          <DeliveryOptionCard
            method="შემდეგ დღეს მოტანა"
            desc="10:00 - დან 13:00 საათამდე"
            imageSrc="/assets/icons/IconDate.svg"
            selected={selectedDelivery === "შემდეგ დღეს მოტანა"}
            disabled={selectedDelivery !== null && selectedDelivery !== "შემდეგ დღეს მოტანა"}
            onSelect={() => toggleDelivery("შემდეგ დღეს მოტანა")}
          />
        </CardsWrapper>

        <InputWithLabel
          icon="/assets/icons/phone icon.svg"
          label="ტელეფონი"
          placeholder="შეიყვანეთ ტელეფონის ნომერი"
          gap={18}
        />

        <Label>დამატებითი ინფორმაცია</Label>
        <TextContainer placeholder="დამატებითი ინფორმაცია" />
      </MobileWrapper>
    </Container>
  );
};

export default Checkout;
