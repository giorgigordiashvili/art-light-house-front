import React from "react";
// import RangeSlider from "./RangeSlider";
import styled from "styled-components";

const Title = styled.p`
  color: white;
  font-family: Helvetica Neue LT GEO;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
  vertical-align: middle;
  margin-bottom: 18px;
`;

const PriceFilter: React.FC = () => {
  return (
    <>
      <Title>ფასი</Title>
      {/* <RangeSlider minLabel="დან" maxLabel="მდე" /> */}
    </>
  );
};

export default PriceFilter;
