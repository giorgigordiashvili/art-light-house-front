import React from "react";
import styled from "styled-components";

const StyledLine = styled.div`
  border: 1px solid #3b3a36;
  width: 100%;
  height: 1px;
`;

const DividerLine = () => {
  return <StyledLine></StyledLine>;
};

export default DividerLine;
