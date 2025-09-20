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

const SummaryPrice = ({ dictionary, text }: any) => {
  return (
    <StyledContainer>
      <StyledText>{dictionary?.cart?.cartModal.summary}</StyledText>
      <StyledPrice>{text ?? dictionary?.cart?.cartModal.sumPrice}</StyledPrice>
    </StyledContainer>
  );
};

export default SummaryPrice;
