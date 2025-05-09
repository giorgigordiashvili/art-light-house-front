"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DetailBar from "../DetailBar/DetailBar";
import AddressBar from "./AddressBar";
import AddressModal from "./modal/AddressModal";
import { AddressData } from "@/types";

const StyledContainer = styled.div`
  display: flex;
  gap: 20px;
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

type Props = {};

const Address = (props: Props) => {
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
        <DetailBar />
        <AddressBar onOpenModal={() => setIsModalOpen(true)} addresses={addresses} />
      </StyledContainer>

      {isModalOpen && (
        <Overlay onClick={() => setIsModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <AddressModal onClose={() => setIsModalOpen(false)} onSave={handleSaveAddress} />
          </div>
        </Overlay>
      )}
    </>
  );
};

export default Address;
