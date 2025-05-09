import React from "react";
import styled from "styled-components";

const StyledTitle = styled.p`
  font-family: Helvetica;
  font-weight: 500;
  font-size: 20px;
  line-height: 159%;
  letter-spacing: 0px;
  vertical-align: middle;
  color: #ffffff;
`;

type Props = {
  text: string;
};

const ModalTitle = (props: Props) => {
  return <StyledTitle>{props.text}</StyledTitle>;
};

export default ModalTitle;
