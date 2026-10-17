"use client";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Placeholder shown behind a remote image until it finishes loading
const ImageShimmer = styled.div<{ $radius?: number }>`
  position: absolute;
  inset: 0;
  border-radius: ${({ $radius }) => $radius ?? 12}px;
  background: linear-gradient(90deg, #ffffff08 0%, #ffffff14 50%, #ffffff08 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  pointer-events: none;
`;

export default ImageShimmer;
