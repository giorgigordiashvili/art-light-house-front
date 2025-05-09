"use client";
import styled from "styled-components";
import { useState } from "react";
import Image from "next/image";
import Order from "@/MyOrders/Order";

const Wrapper = styled.div`
  width: 100%;
  max-width: 100%;
  background-color: transparent;

  @media (min-width: 1080px) {
    display: none;
  }
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #1a1a1a96;
  backdrop-filter: blur(114px);
  border-radius: 16px;
  border: 1px solid #ffffff12;
  cursor: pointer;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;

  span {
    background: linear-gradient(90deg, #f7cb57 0%, #ffd700 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
    font-size: 14px;
    line-height: 28px;
  }

  img {
    filter: brightness(0) saturate(100%) invert(67%) sepia(81%) saturate(360%) hue-rotate(5deg)
      brightness(104%) contrast(102%);
  }
`;

const HeaderRight = styled.div<{ open: boolean }>`
  transition: transform 0.3s ease;
  transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
`;

const DropdownContent = styled.div`
  margin-top: 8px;
`;

const MobileOrderDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <Wrapper>
      <DropdownHeader onClick={() => setOpen(!open)}>
        <HeaderLeft>
          <Image src="/assets/icons/Shekvetebi.svg" alt="ჩემი შეკვეთები" width={24} height={24} />
          <span>ჩემი შეკვეთები</span>
        </HeaderLeft>
        <HeaderRight open={open}>
          <Image
            src="/assets/icons/Dropdown Icon.svg"
            alt="Dropdown Arrow"
            width={24}
            height={24}
          />
        </HeaderRight>
      </DropdownHeader>

      {open && (
        <DropdownContent>
          <Order />
        </DropdownContent>
      )}
    </Wrapper>
  );
};

export default MobileOrderDropdown;
