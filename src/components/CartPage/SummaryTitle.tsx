import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 24px;
  line-height: 24px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #ffffff;
`;

type Props = {
  text: string;
};

const SummaryTitle = (props: Props) => {
  return <StyledContainer>{props.text}</StyledContainer>;
};

export default SummaryTitle;
