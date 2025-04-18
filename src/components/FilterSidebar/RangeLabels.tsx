import React from "react";
import styled from "styled-components";

interface RangeLabelsProps {
  minLabel: string;
  maxLabel: string;
}

const RangeWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const RangeBox = styled.div`
  width: 131px;
  height: 38px;
  background: #111111;
  color: #ccc;
  border-radius: 8px;
  font-size: 18px;
  font-family: inherit;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const RangeLabels: React.FC<RangeLabelsProps> = ({ minLabel, maxLabel }) => {
  return (
    <RangeWrapper>
      <RangeBox>{minLabel}</RangeBox>
      <RangeBox>{maxLabel}</RangeBox>
    </RangeWrapper>
  );
};

export default RangeLabels;
