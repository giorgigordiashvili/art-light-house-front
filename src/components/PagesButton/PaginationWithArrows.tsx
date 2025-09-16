"use client";
import React from "react";
import styled from "styled-components";
import { LeftArrow, RightArrow } from "./ArrowButtons";
import { useProductsPagination } from "@/contexts/ProductsPaginationContext";

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
  top: ${({ active }) => (active ? "0" : "0")}; // თუ გინდა დაბლა დაჯდეს 7პხ
  background-color: ${({ active }) => (active ? "#F1C654" : "transparent")};
`;

const PaginationWithArrows = () => {
  const { page, lastPage, goToPage, isLoading } = useProductsPagination();

  const handlePrev = () => {
    if (page > 1) goToPage(page - 1);
  };

  const handleNext = () => {
    if (page < lastPage) goToPage(page + 1);
  };

  return (
    <PaginationWrapper>
      <div onClick={handlePrev}>
        <LeftArrow />
      </div>
      {Array.from({ length: lastPage }, (_, i) => {
        const pageNum = i + 1;
        return (
          <PageNumber
            key={pageNum}
            active={pageNum === page}
            onClick={() => goToPage(pageNum)}
            disabled={isLoading && pageNum === page}
          >
            {pageNum}
          </PageNumber>
        );
      })}
      <div onClick={handleNext}>
        <RightArrow />
      </div>
    </PaginationWrapper>
  );
};

export default PaginationWithArrows;
