// components/Checkout/DeliveryMethod.tsx
"use client";
import styled from "styled-components";
import { useState } from "react";

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const Option = styled.div<{ selected: boolean }>`
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ selected }) => (selected ? "#ffc107" : "#1c1c1e")};
  color: ${({ selected }) => (selected ? "#000" : "#fff")};
  cursor: pointer;
  text-align: center;
  font-weight: 500;
  border: ${({ selected }) => (selected ? "2px solid #ffcd39" : "1px solid #333")};
`;

const DeliveryMethod = () => {
  const [selected, setSelected] = useState<"express" | "schedule" | null>("express");

  return (
    <Wrapper>
      <Option selected={selected === "express"} onClick={() => setSelected("express")}>
        ექსპრეს მიტანა <br />
        40 წუთიდან 2 საათამდე
      </Option>
      <Option selected={selected === "schedule"} onClick={() => setSelected("schedule")}>
        განსაზღვრული დროის მიტანა <br />
        10:00 - დან 13:00 საათამდე
      </Option>
    </Wrapper>
  );
};

export default DeliveryMethod;
