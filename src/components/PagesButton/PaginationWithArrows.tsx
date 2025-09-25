"use client";
import React from "react";
import styled from "styled-components";
import { LeftArrow, RightArrow } from "./ArrowButtons";

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 34px;
  z-index: 1;
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
  top: ${({ active }) => (active ? "0" : "0")}; // თუ გინდა დაბლა დაჯდეს 7პხ
  background-color: ${({ active }) => (active ? "#F1C654" : "transparent")};
`;

const PaginationWithArrows = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}) => {
  const handlePrev = () => {
    if (hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <PaginationWrapper>
      <div
        onClick={handlePrev}
        style={{
          cursor: hasPreviousPage ? "pointer" : "not-allowed",
          opacity: hasPreviousPage ? 1 : 0.5,
        }}
      >
        <LeftArrow />
      </div>
      {Array.from({ length: totalPages }, (_, i) => (
        <PageNumber key={i + 1} active={i + 1 === currentPage} onClick={() => onPageChange(i + 1)}>
          {i + 1}
        </PageNumber>
      ))}
      <div
        onClick={handleNext}
        style={{ cursor: hasNextPage ? "pointer" : "not-allowed", opacity: hasNextPage ? 1 : 0.5 }}
      >
        <RightArrow />
      </div>
    </PaginationWrapper>
  );
};

export default PaginationWithArrows;
