import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  font-family: HelRom;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0%;
  color: #fafafa;
`;

type Props = {
  text: string;
};

const InputTitle = (props: Props) => {
  return (
    <StyledContainer>
      <p>{props.text}</p>
    </StyledContainer>
  );
};

export default InputTitle;
