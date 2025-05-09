import React from "react";
import styled from "styled-components";

const StyledTitle = styled.p`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 12px;
  line-height: 159%;
  letter-spacing: 0px;
  vertical-align: middle;
  color: #ffffff;
`;

type Props = {
  text: string;
};

const SelectorTitle = (props: Props) => {
  return <StyledTitle>{props.text}</StyledTitle>;
};

export default SelectorTitle;
