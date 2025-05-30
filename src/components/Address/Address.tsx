"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DetailBar from "../DetailBar/DetailBar";
import AddressBar from "./AddressBar";
import AddressModal from "./AddressModal/AddressModal";
import MobileDetailDropdown from "../DetailBar/MobileDetailDropdown";
import ContactTitle from "../Contact/ContactTitle";
import Circle from "../ui/Circle";
import RightCircle from "../ui/RightCircle";
import LeftCircle from "../ui/LeftCircle";
import { AddressData } from "@/types";

const StyledContainer = styled.div`
  position: relative;
  padding-inline: 20px;
  z-index: 1;
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

const Address = ({ dictionary }: any) => {
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
          <AddressBar
            onOpenModal={() => setIsModalOpen(true)}
            addresses={addresses}
            onEditAddress={handleEditAddress}
            dictionary={dictionary}
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
              dictionary={dictionary}
            />
          </StyledModal>
        </Overlay>
      )}
    </>
  );
};

export default Address;
