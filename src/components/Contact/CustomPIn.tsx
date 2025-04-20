import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 39px;
  height: 39px;
  background-color: white;
  border-radius: 50%;
  border: 9px solid #ffcb40;
`;

type Props = {};

const CustomPin = (props: Props) => {
  return <StyledContainer></StyledContainer>;
};

export default CustomPin;
