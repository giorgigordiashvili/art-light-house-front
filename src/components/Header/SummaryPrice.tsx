import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-inline: 20px;
  margin-top: 14px;
`;

const StyledText = styled.p`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #ffffff;
`;

const StyledPrice = styled.p`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  color: #ffffff;
`;

type Props = {};

const SummaryPrice = (props: Props) => {
  return (
    <StyledContainer>
      <StyledText>ჯამური ფასი</StyledText>
      <StyledPrice>599,32</StyledPrice>
    </StyledContainer>
  );
};

export default SummaryPrice;
