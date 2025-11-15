"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

interface FiltersLoadingSkeletonProps {
  sections?: number;
  rowsPerSection?: number;
  compact?: boolean;
}

const shimmer = keyframes`
  0% {
    background-position: -240px 0;
  }
  100% {
    background-position: 240px 0;
  }
`;

const SkeletonWrapper = styled.div<{ $compact?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $compact }) => ($compact ? "16px" : "20px")};
  padding: ${({ $compact }) => ($compact ? "4px 0" : "8px 0")};
`;

const SkeletonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkeletonTitle = styled.div<{ $compact?: boolean }>`
  width: ${({ $compact }) => ($compact ? "120px" : "160px")};
  height: 18px;
  border-radius: 999px;
  background: linear-gradient(90deg, #2c2c2c 0%, #3a3a3a 50%, #2c2c2c 100%);
  background-size: 360px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

const SkeletonLine = styled.div`
  width: 100%;
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(90deg, #2c2c2c 0%, #3a3a3a 50%, #2c2c2c 100%);
  background-size: 360px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

const FiltersLoadingSkeleton: React.FC<FiltersLoadingSkeletonProps> = ({
  sections = 2,
  rowsPerSection = 3,
  compact = false,
}) => {
  return (
    <SkeletonWrapper $compact={compact} aria-hidden="true">
      {Array.from({ length: sections }).map((_, sectionIndex) => (
        <SkeletonSection key={`filters-loading-${sectionIndex}`}>
          <SkeletonTitle $compact={compact} />
          {Array.from({ length: rowsPerSection }).map((__, rowIndex) => (
            <SkeletonLine key={`filters-loading-${sectionIndex}-${rowIndex}`} />
          ))}
        </SkeletonSection>
      ))}
    </SkeletonWrapper>
  );
};

export default FiltersLoadingSkeleton;
