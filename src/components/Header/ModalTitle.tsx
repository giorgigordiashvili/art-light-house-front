import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 32px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #ffffff;
  text-align: center;
  @media (max-width: 1080px) {
    font-family: Helvetica;
    font-weight: 300;
    font-size: 24px;
    line-height: 100%;
    letter-spacing: 0%;
  }
`;

type Props = {
  text: string;
};

const ModalTitle = (props: Props) => {
  return (
    <StyledContainer>
      <p>{props.text}</p>
    </StyledContainer>
  );
};

export default ModalTitle;
