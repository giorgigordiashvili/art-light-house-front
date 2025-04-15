import React from "react";
import styled from "styled-components";

const StyledText = styled.div`
  font-family: HelRom;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #fafafa;
  cursor: pointer;
`;

type Props = {
  text: string;
};

const NavItem = (props: Props) => {
  return (
    <StyledText>
      <p>{props.text}</p>
    </StyledText>
  );
};

export default NavItem;
