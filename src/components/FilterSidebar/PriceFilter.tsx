import React from "react";
// import RangeSlider from "./RangeSlider";
import styled from "styled-components";
import { useLanguage } from "@/context/LanguageContext";

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

const PriceFilter: React.FC = () => {
  const { dictionary } = useLanguage();
  return (
    <>
      <Title>{dictionary.products.filter.subTitle2}</Title>
      {/* <RangeSlider minLabel={dictionary.products.placeholder1} maxLabel={dictionary.products.placeholder2} /> */}
    </>
  );
};

export default PriceFilter;
