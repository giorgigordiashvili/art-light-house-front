import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledCount = styled.p`
  color: #ffcb40;
  font-family: Helvetica;
  font-weight: 600;
  font-size: 60px;
  line-height: 72px;
  letter-spacing: -2%;
  text-align: center;
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
  return (
    <StyledContainer>
      <StyledCount> {props.count} </StyledCount>
      <StyledSubTitle> {props.subTitle} </StyledSubTitle>
    </StyledContainer>
  );
};

export default Counts;
