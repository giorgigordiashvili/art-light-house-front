import React from "react";
import styled from "styled-components";
import AddButton from "./AddButton";
import LampaImage from "./Image";
import ProductText from "./Text"
const StyledRectangle = styled.div`
  width: 308px;
  height: 417px;
  border-radius: 17px;
  border: 1px solid #ffffff12;
  background: #1a1a1a96;
  backdrop-filter: blur(114px);
  @media (max-width: 1080px) {
    width: 170px;
    height: 275px;
    top: 335px;
    left: 20px;
  }
`;

function Card() {
    return (
      <StyledRectangle>
        <LampaImage />
        <ProductText />
        <AddButton />
      </StyledRectangle>
    );
  }

export default Card;