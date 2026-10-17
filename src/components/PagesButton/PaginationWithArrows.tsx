"use client";
import React from "react";
import styled from "styled-components";
import { LeftArrow, RightArrow } from "./ArrowButtons";

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 34px;
  z-index: 1;

  @media (max-width: 480px) {
    gap: 20px;
  }
`;

const PageNumber = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? "#F1C654" : "transparent")};
  color: ${({ $active }) => ($active ? "#000" : "#fff")};
  font-size: 16px;
  width: ${({ $active }) => ($active ? "51px" : "9px")};
  height: ${({ $active }) => ($active ? "51px" : "24px")};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ $active }) => ($active ? "50%" : "0")};
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  position: relative;
  top: ${({ $active }) => ($active ? "0" : "0")}; // თუ გინდა დაბლა დაჯდეს 7პხ
  background-color: ${({ $active }) => ($active ? "#F1C654" : "transparent")};
`;

const Ellipsis = styled.span`
  color: #fff;
  font-size: 16px;
  min-width: 9px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`;

type PageItem = number | "ellipsis-left" | "ellipsis-right";

const getPageItems = (currentPage: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items: PageItem[] = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  if (currentPage - 1 > 2) items.push("ellipsis-left");
  for (let page = start; page <= end; page++) items.push(page);
  if (currentPage + 1 < totalPages - 1) items.push("ellipsis-right");
  items.push(totalPages);
  return items;
};

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
      {getPageItems(currentPage, totalPages).map((item) => {
        if (typeof item !== "number") {
          return (
            <Ellipsis key={item} aria-hidden="true">
              ...
            </Ellipsis>
          );
        }
        const isActive = item === currentPage;
        return (
          <PageNumber
            key={item}
            $active={isActive}
            aria-current={isActive ? "page" : undefined}
            onClick={isActive ? undefined : () => onPageChange(item)}
          >
            {item}
          </PageNumber>
        );
      })}
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
