import React from "react";
import styled from "styled-components";
import Image from "next/image";
import CartTitle from "./CartTitle";
import CartDescription from "./CartDescription";

const StyledContainer = styled.div`
  width: 349px;
  height: 312px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 99px;
  background-color: #1a1a1a96;
  backdrop-filter: blur(114px);
  border: 1px solid #ffffff12;
  border-radius: 17px;
  padding: 0;
  z-index: 1001;

  @media (max-width: 1332px) {
    right: 20px;
  }

  @media (max-width: 1080px) {
    width: 100%;
    bottom: 0;
    top: auto;
    right: 0;
    background-color: #1c1c1c;
    height: auto;
    padding: 19px 20px 72px 20px;
    border-radius: 14px 14px 0 0;
  }
`;

const StyledImage = styled.div`
  margin-top: 48px;

  @media (max-width: 1080px) {
    margin-top: 0;
  }
`;

const ModalLayoutWrapper = styled.div`
  width: 100%;
  margin: auto;
`;

const ModalLayout = styled.div`
  width: 1292px;
  display: flex;
  justify-content: flex-end;
`;

const EmptyCartModal = () => {
  return (
    <ModalLayoutWrapper>
      <ModalLayout>
        <StyledContainer>
          <StyledImage>
            <Image src="/assets/EmptyCartImage.svg" width={123} height={123} alt="cart-icon" />
          </StyledImage>
          <CartTitle text="კალათა ცარიელია" />
          <CartDescription text="დაამატე პროდუქტები ქალათში და გააფორმე შეკვეთა" />
        </StyledContainer>
      </ModalLayout>
    </ModalLayoutWrapper>
  );
};

export default EmptyCartModal;
