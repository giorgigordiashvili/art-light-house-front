"use client";
import styled from "styled-components";
import { useState } from "react";
import Image from "next/image";

const Container = styled.div`
  width: 230px;
  background-color: #0d0d0d;
  border-radius: 16px;
  color: #fff;
  font-family: inherit;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Item = styled.div<{ active?: boolean; logout?: boolean }>`
  padding: 12px 20px;
  font-size: 15px;
  color: ${({ active, logout }) => (logout ? "#ff4d4f" : active ? "#ffd700" : "#bcbcbc")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  cursor: pointer;
  border-bottom: 1px solid #1f1f1f;
  display: flex;
  align-items: center;
  gap: 12px;

  &:last-child {
    border-bottom: none;
    margin-top: auto;
  }

  &:hover {
    background-color: #1a1a1a;
  }
`;

const IconWrapper = styled.div`
  width: 18px;
  height: 18px;
  position: relative;
  flex-shrink: 0;
`;

const menuItems = [
  { label: "ჩემი დეტალები", icon: "/assets/icons/Details.svg" },
  { label: "ჩემი მისამართები", icon: "/assets/icons/misamarti.svg" },
  { label: "ჩემი შეკვეთები", icon: "/assets/icons/Shekvetebi.svg" },
  { label: "გადახდის მეთოდები", icon: "/assets/icons/gadaxda.svg" },
  { label: "პარამეტრები", icon: "/assets/icons/settings.svg" },
];

const DetailBar = () => {
  const [active, setActive] = useState("ჩემი დეტალები");

  return (
    <Container>
      {menuItems.map(({ label, icon }) => (
        <Item key={label} active={active === label} onClick={() => setActive(label)}>
          <IconWrapper>
            <Image src={icon} alt={label} fill sizes="18px" />
          </IconWrapper>
          {label}
        </Item>
      ))}
      <Item logout>
        <IconWrapper>
          <Image src="/assets/icons/Logout.svg" alt="გასვლა" fill sizes="18px" />
        </IconWrapper>
        გასვლა
      </Item>
    </Container>
  );
};

export default DetailBar;
