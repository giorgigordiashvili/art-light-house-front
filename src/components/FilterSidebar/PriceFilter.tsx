import React from "react";
// import RangeSlider from "./RangeSlider";
import styled from "styled-components";

const Title = styled.p`
  color: white;
  font-family: Helvetica;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
  vertical-align: middle;
  margin-bottom: 18px;
`;

interface PriceFilterProps {
  dictionary: any;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ dictionary }) => {
  return (
    <>
      <Title>{dictionary.subTitle2}</Title>
      {/* <RangeSlider minLabel="დან" maxLabel="მდე" /> */}
    </>
  );
};

export default PriceFilter;
