import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  max-width: 1292px;
  margin: 0 auto;
  @media (max-width: 1080px) {
    width: 100%;
    padding-inline: 20px;
  }
`;
type Props = {
  children: React.ReactNode;
};

function Container({ children }: Props) {
  return <StyledContainer>{children}</StyledContainer>;
}

export default Container;
