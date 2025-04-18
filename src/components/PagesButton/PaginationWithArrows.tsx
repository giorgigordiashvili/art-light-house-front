"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { LeftArrow, RightArrow } from "./ArrowButtons";

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 34px;
`;

const PageNumber = styled.button<{ active?: boolean }>`
  background: ${({ active }) => (active ? "#F1C654" : "transparent")};
  color: ${({ active }) => (active ? "#000" : "#fff")};
  font-size: 16px;
  width: ${({ active }) => (active ? "51px" : "9px")};
  height: ${({ active }) => (active ? "51px" : "24px")};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ active }) => (active ? "50%" : "0")};
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  position: relative;
  top: ${({ active }) => (active ? "0" : "7px")}; // თუ გინდა დაბლა დაჯდეს
  background-color: ${({ active }) => (active ? "#F1C654" : "transparent")};
`;

const PaginationWithArrows = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <PaginationWrapper>
      <div onClick={handlePrev}>
        <LeftArrow />
      </div>
      {Array.from({ length: totalPages }, (_, i) => (
        <PageNumber
          key={i + 1}
          active={i + 1 === currentPage}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </PageNumber>
      ))}
      <div onClick={handleNext}>
        <RightArrow />
      </div>
    </PaginationWrapper>
  );
};

export default PaginationWithArrows;
