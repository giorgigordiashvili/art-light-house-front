import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  font-family: HelRom;
  font-weight: 400;
  font-size: 13px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #8e8e8e;
  cursor: pointer;
`;

type Props = {
  text: string;
  onClick?: () => void;
};

const AdditionalAction = ({ text, onClick }: Props) => {
  return (
    <StyledContainer onClick={onClick}>
      <p>{text}</p>
    </StyledContainer>
  );
};

export default AdditionalAction;
