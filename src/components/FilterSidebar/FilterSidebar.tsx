"use client";
import React from "react";
import styled from "styled-components";
import CategoryFilter from "./CategoryFilter";
import Line from "./Line";
import StyleFilter from "./StyleFilter";
import TypeFilter from "./TypeFilter";
import PriceFilter from "./PriceFilter";

const SidebarWrapper = styled.div`
  width: 308px;
  height: 1083px;
  border-radius: 17px;
  border: 1px solid #ffffff12;
  background: #1a1a1a96;
  backdrop-filter: blur(114px);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  font-family: "Helvetica", sans-serif;
  font-weight: 700;
  font-size: 22px;
  line-height: 24px;
  letter-spacing: 0%;
  color: white;
`;

interface FilterSidebarProps {
  dictionary: any;
}

function FilterSidebar({ dictionary }: FilterSidebarProps) {
  // No longer need manual apply button since filtering is immediate

  return (
    <SidebarWrapper>
      <Title>{dictionary.title}</Title>
      <Line />
      <CategoryFilter dictionary={dictionary} />
      <Line />
      <PriceFilter dictionary={dictionary} />
      <Line />
      <StyleFilter dictionary={dictionary} />
      <Line />
      <TypeFilter dictionary={dictionary} />
    </SidebarWrapper>
  );
}

export default FilterSidebar;
