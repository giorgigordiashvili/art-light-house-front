"use client";
import React from "react";
import styled, { keyframes } from "styled-components";
import CategoryFilter from "../FilterSidebar/CategoryFilter";
import Line from "../FilterSidebar/Line";
import StyleFilter from "../FilterSidebar/StyleFilter";
import TypeFilter from "../FilterSidebar/TypeFilter";
import PriceFilter from "../FilterSidebar/PriceFilter";
import ButtonFilter from "./ButtonFilter";

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;

const DropdownWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 677px;
  background: #1c1c1c;
  backdrop-filter: blur(114px);
  border-radius: 20px 20px 0 0;
  z-index: 1000;
  animation: ${slideUp} 0.3s ease-out;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ScrollArea = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const BottomBar = styled.div`
  width: 100%;
  height: 111px;
  background-color: #1c1c1c;
  border-top: 1px solid #313131;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.p`
  font-family: "Helvetica", sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: white;
  margin-bottom: 16px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 12px;
  font-weight: 300;
  position: absolute;
  right: 20px;
  cursor: pointer;
`;

interface MobileFilterDropdownProps {
  onClose: () => void;
  dictionary: any;
}

const MobileFilterDropdown: React.FC<MobileFilterDropdownProps> = ({ onClose, dictionary }) => {
  return (
    <>
      <Overlay onClick={onClose} />
      <DropdownWrapper>
        <ScrollArea>
          <CloseButton onClick={onClose}>{dictionary.filter.clear}</CloseButton>
          <Title>{dictionary.filter.title}</Title>
          <Line />
          <CategoryFilter dictionary={dictionary.filter} />
          <Line />
          <PriceFilter dictionary={dictionary.filter} />
          <Line />
          <StyleFilter dictionary={dictionary.filter} />
          <Line />
          <TypeFilter dictionary={dictionary.filter} />
        </ScrollArea>

        <BottomBar>
          <ButtonFilter
            onClick={() => {
              console.log("გაფილტვრა დააჭირეს");
              onClose(); // ღილაკზე დაჭერის შემდეგ dropdown იკეტება
            }}
            dictionary={dictionary}
          />
        </BottomBar>
      </DropdownWrapper>
    </>
  );
};

export default MobileFilterDropdown;
