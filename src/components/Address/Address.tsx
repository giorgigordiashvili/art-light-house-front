"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DetailBar from "../DetailBar/DetailBar";
import AddressBar from "./AddressBar";
import AddressModal from "./AddressModal/AddressModal";
import MobileDetailDropdown from "../DetailBar/MobileDetailDropdown";
import ContactTitle from "../Contact/ContactTitle";
import { AddressData } from "@/types";

const StyledContainer = styled.div`
  padding-inline: 20px;
  @media (max-width: 1080px) {
    padding-inline: 0;
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
  padding-top: 140px;
  z-index: 9999;
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
const StyledDesktopDetail = styled.div`
  display: flex;
  flex-shrink: 0;
  @media (max-width: 1080px) {
    display: none;
  }
`;

const StyledMobileDetail = styled.div`
  display: none;
  @media (max-width: 1080px) {
    display: flex;
  }
`;

const Address = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<AddressData[]>([]);

  const handleSaveAddress = (newAddress: AddressData) => {
    setAddresses([...addresses, newAddress]);
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <>
      <StyledContainer>
        <div>
          <ContactTitle text="ჩემი მისამართები" />
        </div>
        <StyledBars>
          <StyledDesktopDetail>
            <DetailBar />
          </StyledDesktopDetail>
          <StyledMobileDetail>
            <MobileDetailDropdown />
          </StyledMobileDetail>
          <AddressBar onOpenModal={() => setIsModalOpen(true)} addresses={addresses} />
        </StyledBars>
      </StyledContainer>

      {isModalOpen && (
        <Overlay onClick={() => setIsModalOpen(false)}>
          <StyledModal onClick={(e) => e.stopPropagation()}>
            <AddressModal onClose={() => setIsModalOpen(false)} onSave={handleSaveAddress} />
          </StyledModal>
        </Overlay>
      )}
    </>
  );
};

export default Address;
