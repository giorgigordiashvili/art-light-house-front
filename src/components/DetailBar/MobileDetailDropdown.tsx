"use client";
import styled from "styled-components";
import { useState } from "react";
import Image from "next/image";

const Wrapper = styled.div`
  width: 350px;
  max-width: 100%;
  background-color: transparent;
  z-index: 1;

  @media (min-width: 1080px) {
    display: none;
    width: 100%;
    max-width: 100%;
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

const DropdownMenu = styled.div`
  margin-top: 8px;
  background-color: #1a1a1a96;
  backdrop-filter: blur(114px);
  border: 1px solid #ffffff12;
  border-radius: 17px;
  overflow: hidden;
`;

const MenuItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 24px;
  /* 20 არის თუ 16 გასარკვევია პადინგ ტოპ */
  font-weight: 700;
  font-size: 14px;
  line-height: 28px;
  cursor: pointer;
  border-bottom: 1px solid #242424;
  background-color: transparent;

  &:last-child {
    border-bottom: none;
  }

  color: ${({ selected }) => (selected ? "transparent" : "#edededcc")};
  background: ${({ selected }) =>
    selected ? "linear-gradient(90deg, #F7CB57 0%, #FFD700 100%)" : "none"};
  -webkit-background-clip: ${({ selected }) => (selected ? "text" : "unset")};
  -webkit-text-fill-color: ${({ selected }) => (selected ? "transparent" : "#edededcc")};

  &:hover {
    color: transparent;
    background: linear-gradient(90deg, #f7cb57 0%, #ffd700 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  img {
    flex-shrink: 0;
    filter: ${({ selected }) =>
      selected
        ? `brightness(0) saturate(100%) invert(67%) sepia(81%) saturate(360%) hue-rotate(5deg)
        brightness(104%) contrast(102%)`
        : "none"};
  }

  &:hover img {
    filter: brightness(0) saturate(100%) invert(67%) sepia(81%) saturate(360%) hue-rotate(5deg)
      brightness(104%) contrast(102%);
  }
`;

const MobileDetailDropdown = () => {
  const menuItems = [
    { label: "ჩემი დეტალები", icon: "/assets/icons/Details.svg" },
    { label: "ჩემი მისამართები", icon: "/assets/icons/misamarti.svg" },
    { label: "ჩემი შეკვეთები", icon: "/assets/icons/Shekvetebi.svg" },
    { label: "გადახდის მეთოდები", icon: "/assets/icons/gadaxda.svg" },
    { label: "პარამეტრები", icon: "/assets/icons/settings.svg" },
  ];

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(menuItems[0]);

  const handleSelect = (item: { label: string; icon: string }) => {
    setSelectedItem(item);
    setOpen(false);
  };

  return (
    <Wrapper>
      <DropdownHeader onClick={() => setOpen(!open)}>
        <HeaderLeft>
          <Image src={selectedItem.icon} alt="აიქონი" width={24} height={24} />
          <span>{selectedItem.label}</span>
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
        <DropdownMenu>
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => handleSelect(item)}
              selected={item.label === selectedItem.label}
            >
              <Image src={item.icon} alt={item.label} width={24} height={24} />
              {item.label}
            </MenuItem>
          ))}
        </DropdownMenu>
      )}
    </Wrapper>
  );
};

export default MobileDetailDropdown;
