import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledCountWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Number = styled.span`
  color: #ffcb40;
  font-family: Helvetica;
  font-weight: 600;
  font-size: 60px;
  line-height: 72px;
  letter-spacing: -2%;
`;

const Plus = styled.span`
  color: #ffcb40;
  font-family: Helvetica;
  font-weight: 600;
  font-size: 60px;
  line-height: 72px;
  margin-left: 4px;
  position: relative;
  top: -6px;
`;

const StyledSubTitle = styled.p`
  color: #ffffff;
  font-family: Helvetica;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  letter-spacing: -2%;
  text-align: center;
`;

type Props = {
  count: string;
  subTitle: string;
};

const Counts = (props: Props) => {
  const hasPlus = props.count.includes("+");
  const numberOnly = props.count.replace("+", "");

  return (
    <StyledContainer>
      <StyledCountWrapper>
        <Number>{numberOnly}</Number>
        {hasPlus && <Plus>+</Plus>}
      </StyledCountWrapper>
      <StyledSubTitle>{props.subTitle}</StyledSubTitle>
    </StyledContainer>
  );
};

export default Counts;
