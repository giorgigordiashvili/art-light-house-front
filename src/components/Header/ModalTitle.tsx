import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  font-family: HelRom;
  font-weight: 300;
  font-size: 32px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #ffffff;
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
