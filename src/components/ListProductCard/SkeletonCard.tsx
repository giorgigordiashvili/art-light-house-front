"use client";
import React from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const StyledRectangle = styled.div`
  width: 308px;
  height: 417px;
  border-radius: 17px;
  border: 1px solid #ffffff12;
  background: #1a1a1a96;
  z-index: 2;
  backdrop-filter: blur(114px);
  position: relative;
  overflow: hidden;

  @media (max-width: 1080px) {
    width: 170px;
    height: 275px;
  }
`;

const SkeletonElement = styled.div`
  background: linear-gradient(90deg, #2a2a2a 0%, #3a3a3a 50%, #2a2a2a 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

const ImageSkeleton = styled(SkeletonElement)`
  position: absolute;
  width: 200px;
  height: 180px;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 12px;

  @media (max-width: 1080px) {
    width: 120px;
    height: 120px;
    top: 17px;
  }
`;

const ContentWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 1080px) {
    bottom: 15px;
    left: 12px;
    right: 12px;
    gap: 8px;
  }
`;

const TitleSkeleton = styled(SkeletonElement)`
  height: 20px;
  width: 70%;

  @media (max-width: 1080px) {
    height: 16px;
  }
`;

const PriceSkeleton = styled(SkeletonElement)`
  height: 24px;
  width: 40%;

  @media (max-width: 1080px) {
    height: 18px;
  }
`;

const ButtonSkeleton = styled(SkeletonElement)`
  height: 40px;
  width: 100%;
  border-radius: 20px;

  @media (max-width: 1080px) {
    height: 32px;
  }
`;

const HeartSkeleton = styled(SkeletonElement)`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 24px;
  height: 24px;
  border-radius: 50%;

  @media (max-width: 1080px) {
    width: 20px;
    height: 20px;
    top: 10px;
    right: 10px;
  }
`;

const SkeletonCard = () => {
  return (
    <StyledRectangle>
      <HeartSkeleton />
      <ImageSkeleton />
      <ContentWrapper>
        <TitleSkeleton />
        <PriceSkeleton />
        <ButtonSkeleton />
      </ContentWrapper>
    </StyledRectangle>
  );
};

export default SkeletonCard;
