import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  font-family: Helvetica;
  font-weight: 500;
  font-size: 24px;
  line-height: 24px;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  color: #ffffff;
`;

type Props = {
  text: string;
};

const SummaryPrice = (props: Props) => {
  return <StyledContainer>{props.text}</StyledContainer>;
};

export default SummaryPrice;
