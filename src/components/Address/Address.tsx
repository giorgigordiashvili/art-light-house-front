"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DetailBar from "../DetailBar/DetailBar";
import AddressBar from "./AddressBar";
import AddressModal from "./modal/AddressModal";

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
        <AddressBar onOpenModal={() => setIsModalOpen(true)} />
      </StyledContainer>

      {isModalOpen && (
        <Overlay onClick={() => setIsModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <AddressModal />
          </div>
        </Overlay>
      )}
    </>
  );
};

export default Address;
