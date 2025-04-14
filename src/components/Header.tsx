import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Container from "./ui/Container";

const StyledContainer = styled.div`
  background-color: #000;
  color: red;
`;
type Props = {};

const Header = (props: Props) => {
  return (
    <StyledContainer>
      <Container>
        <Image src="/assets/Logo.png" alt="logo" width={111} height={45} />
      </Container>
    </StyledContainer>
  );
};

export default Header;
