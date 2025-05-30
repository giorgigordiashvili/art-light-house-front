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

interface CheckoutProps {
  dictionary?: {
    checkout?: {
      title?: string;
      subTitle1?: string;
      subTitle2?: string;
      subTitle3?: string;
      subTitle4?: string;
      subTitle5?: string;
      cardTitle1?: string;
      cardTitle2?: string;
      cardTitle3?: string;
      cardTitle4?: string;
      cardDescription1?: string;
      cardDescription2?: string;
      cardDescription3?: string;
      cardDescription4?: string;
      placeholder1?: string;
      placeholder2?: string;
    };
  };
}

const Checkout: React.FC<CheckoutProps> = ({ dictionary }) => {
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);

  const toggleDelivery = (method: string) => {
    setSelectedDelivery(selectedDelivery === method ? null : method);
  };

  const getDeliverySelected = (method?: string) => selectedDelivery === method;
  const getDeliveryDisabled = (method?: string) =>
    selectedDelivery !== null && selectedDelivery !== method;

  return (
    <Container>
      <DesktopWrapper>
        <PageTitle>{dictionary?.checkout?.title || "შეკვეთის გაფორმება"}</PageTitle>

        <CheckoutContent>
          <LeftSection>
            <CheckoutCard
              label={dictionary?.checkout?.subTitle1 || "მისამართი"}
              method={dictionary?.checkout?.cardTitle1 || "სამსახური"}
              desc={dictionary?.checkout?.cardDescription1 || "5 Petre Kavtaradze Street"}
              imageSrc="/assets/icons/job.svg"
            />

            <CheckoutCard
              label={dictionary?.checkout?.subTitle2 || "გადახდის მეთოდი"}
              method={dictionary?.checkout?.cardTitle2 || "ბარათი"}
              desc={
                dictionary?.checkout?.cardDescription2 ||
                "ტრანზაქციის შემდეგ თქვენი ბარათის მონაცემები შეინახება ბანკის დაცულ სერვერზე"
              }
              imageSrc="/assets/icons/gadaxda.svg"
            />
          </LeftSection>

          <RightSection>
            <Summery dictionary={dictionary?.checkout} />
          </RightSection>
        </CheckoutContent>

        <Label>{dictionary?.checkout?.subTitle3 || "მიწოდება"}</Label>
        <CardsWrapper>
          <DeliveryOptionCard
            method={dictionary?.checkout?.cardTitle3 || "ექსპრეს მოტანა"}
            desc={dictionary?.checkout?.cardDescription3 || "40 წუთიდან 2 საათამდე"}
            imageSrc="/assets/Delivery Icon.svg"
            selected={getDeliverySelected(dictionary?.checkout?.cardTitle3)}
            disabled={getDeliveryDisabled(dictionary?.checkout?.cardTitle3)}
            onSelect={() => toggleDelivery(dictionary?.checkout?.cardTitle3 || "")}
          />
          <DeliveryOptionCard
            method={dictionary?.checkout?.cardTitle4 || "შემდეგ დღეს მოტანა"}
            desc={dictionary?.checkout?.cardDescription4 || "10:00 - დან 13:00 საათამდე"}
            imageSrc="/assets/icons/IconDate.svg"
            selected={getDeliverySelected(dictionary?.checkout?.cardTitle4)}
            disabled={getDeliveryDisabled(dictionary?.checkout?.cardTitle4)}
            onSelect={() => toggleDelivery(dictionary?.checkout?.cardTitle4 || "")}
          />
        </CardsWrapper>

        <InputWithLabel
          icon="/assets/icons/phone icon.svg"
          label={dictionary?.checkout?.subTitle4 || "ტელეფონი"}
          placeholder={dictionary?.checkout?.placeholder1 || "შეიყვანეთ ტელეფონის ნომერი"}
          gap={18}
        />

        <Label>{dictionary?.checkout?.subTitle5 || "დამატებითი ინფორმაცია"}</Label>
        <TextContainer
          placeholder={dictionary?.checkout?.placeholder2 || "დამატებითი ინფორმაცია"}
        />
      </DesktopWrapper>

      <MobileWrapper>
        <PageTitle>{dictionary?.checkout?.title || "შეკვეთის გაფორმება"}</PageTitle>

        <CheckoutCard
          label={dictionary?.checkout?.subTitle1 || "მისამართი"}
          method={dictionary?.checkout?.cardTitle1 || "სამსახური"}
          desc={dictionary?.checkout?.cardDescription1 || "5 Petre Kavtaradze Street"}
          imageSrc="/assets/icons/job.svg"
        />

        <CheckoutCard
          label={dictionary?.checkout?.subTitle2 || "გადახდის მეთოდი"}
          method={dictionary?.checkout?.cardTitle2 || "ბარათი"}
          desc={
            dictionary?.checkout?.cardDescription2 ||
            "ტრანზაქციის შემდეგ თქვენი ბარათის მონაცემები შეინახება ბანკის დაცულ სერვერზე"
          }
          imageSrc="/assets/icons/gadaxda.svg"
        />

        <RightSection>
          <Summery dictionary={dictionary?.checkout} />
        </RightSection>

        <Label>{dictionary?.checkout?.subTitle3 || "მიწოდება"}</Label>
        <CardsWrapper>
          <DeliveryOptionCard
            method={dictionary?.checkout?.cardTitle3 || "ექსპრეს მოტანა"}
            desc={dictionary?.checkout?.cardDescription3 || "40 წუთიდან 2 საათამდე"}
            imageSrc="/assets/Delivery Icon.svg"
            selected={getDeliverySelected(dictionary?.checkout?.cardTitle3)}
            disabled={getDeliveryDisabled(dictionary?.checkout?.cardTitle3)}
            onSelect={() => toggleDelivery(dictionary?.checkout?.cardTitle3 || "")}
          />
          <DeliveryOptionCard
            method={dictionary?.checkout?.cardTitle4 || "შემდეგ დღეს მოტანა"}
            desc={dictionary?.checkout?.cardDescription4 || "10:00 - დან 13:00 საათამდე"}
            imageSrc="/assets/icons/IconDate.svg"
            selected={getDeliverySelected(dictionary?.checkout?.cardTitle4)}
            disabled={getDeliveryDisabled(dictionary?.checkout?.cardTitle4)}
            onSelect={() => toggleDelivery(dictionary?.checkout?.cardTitle4 || "")}
          />
        </CardsWrapper>

        <InputWithLabel
          icon="/assets/icons/phone icon.svg"
          label={dictionary?.checkout?.subTitle4 || "ტელეფონი"}
          placeholder={dictionary?.checkout?.placeholder1 || "შეიყვანეთ ტელეფონის ნომერი"}
          gap={18}
        />

        <Label>{dictionary?.checkout?.subTitle5 || "დამატებითი ინფორმაცია"}</Label>
        <TextContainer
          placeholder={dictionary?.checkout?.placeholder2 || "დამატებითი ინფორმაცია"}
        />
      </MobileWrapper>
    </Container>
  );
};

export default Checkout;
