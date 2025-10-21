import React, { useState } from "react";
import styled from "styled-components";

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 34px;
  justify-content: center;
`;

const PageNumber = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? "#F1C654" : "transparent")};
  color: ${({ $active }) => ($active ? "#000" : "#fff")};
  font-size: 16px;
  width: 9px;
  height: 51px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#F1C654" : "#333")};
  }
`;

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = [1, 2, 3, 4];

  return (
    <PaginationWrapper>
      {pages.map((page) => (
        <PageNumber key={page} $active={page === currentPage} onClick={() => setCurrentPage(page)}>
          {page}
        </PageNumber>
      ))}
    </PaginationWrapper>
  );
};

export default Pagination;
