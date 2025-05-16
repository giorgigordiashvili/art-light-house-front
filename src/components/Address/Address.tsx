"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DetailBar from "../DetailBar/DetailBar";
import AddressBar from "./AddressBar";
import AddressModal from "./AddressModal/AddressModal";
import MobileDetailDropdown from "../DetailBar/MobileDetailDropdown";
import ContactTitle from "../Contact/ContactTitle";
import Circle from "../ui/Circle";
import { AddressData } from "@/types";

const StyledContainer = styled.div`
  position: relative;
  padding-inline: 20px;
  @media (max-width: 1080px) {
    padding-inline: 0;
  }
`;

const StyledCircle = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

// const StyledCircle = styled.div`
//   width: 284px;
//   height: 284px;
//   opacity: 0.64;
//   position: absolute;
//   left: 50%;
//   transform: translateX(-50%);
//   background: radial-gradient(
//     circle,
//     rgba(255, 203, 64, 0.44) 0%,
//     rgba(255, 203, 64, 0.1) 80%,
//     rgba(255, 203, 64, 0) 100%
//   );
//   filter: blur(100px);
//   border-radius: 50%;
//   z-index: 1;
//   @media (max-width: 1080px) {
//     display: none;
//   }
// `;

// const StyledLeftCircle = styled.div`
//   width: 284px;
//   height: 284px;
//   opacity: 0.64;
//   position: absolute;
//   bottom: 35px;
//   left: -80px;
//   background: radial-gradient(
//     circle,
//     rgba(255, 203, 64, 0.44) 0%,
//     rgba(255, 203, 64, 0.1) 80%,
//     rgba(255, 203, 64, 0) 100%
//   );
//   filter: blur(100px);
//   border-radius: 50%;
//   z-index: 1;
//   @media (max-width: 1080px) {
//     display: none;
//   }
// `;

// const StyledRightCircle = styled.div`
//   width: 284px;
//   height: 284px;
//   opacity: 0.64;
//   position: absolute;
//   bottom: -70px;
//   right: 0;
//   background: radial-gradient(
//     circle,
//     rgba(255, 203, 64, 0.44) 0%,
//     rgba(255, 203, 64, 0.1) 80%,
//     rgba(255, 203, 64, 0) 100%
//   );
//   filter: blur(100px);
//   border-radius: 50%;
//   z-index: 1;
//   @media (max-width: 1080px) {
//     display: none;
//   }
// `;

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

const Address = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);

  const handleSaveAddress = (newAddress: AddressData) => {
    setAddresses([...addresses, newAddress]);
    setIsModalOpen(false);
  };

  const handleEditAddress = (address: AddressData) => {
    setEditingAddress(address);
  };

  const handleSaveEditedAddress = (updatedData: AddressData) => {
    setAddresses((prev) => prev.map((addr) => (addr === editingAddress ? updatedData : addr)));
    setEditingAddress(null);
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen || editingAddress ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, editingAddress]);

  return (
    <>
      <StyledContainer>
        <StyledCircle>
          <Circle size="small" />
        </StyledCircle>
        <div>
          <ContactTitle text="ჩემი მისამართები" />
        </div>
        <StyledBars>
          <DetailBar />
          <StyledMobileDetail>
            <MobileDetailDropdown />
          </StyledMobileDetail>
          <AddressBar
            onOpenModal={() => setIsModalOpen(true)}
            addresses={addresses}
            onEditAddress={handleEditAddress}
          />
        </StyledBars>
      </StyledContainer>

      {(isModalOpen || editingAddress) && (
        <Overlay
          onClick={() => {
            setIsModalOpen(false);
            setEditingAddress(null);
          }}
        >
          <StyledModal onClick={(e) => e.stopPropagation()}>
            <AddressModal
              onClose={() => {
                setIsModalOpen(false);
                setEditingAddress(null);
              }}
              onSave={editingAddress ? handleSaveEditedAddress : handleSaveAddress}
              initialData={editingAddress || undefined}
            />
          </StyledModal>
        </Overlay>
      )}
    </>
  );
};

export default Address;
