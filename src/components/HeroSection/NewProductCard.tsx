import React from "react";
import styled from "styled-components";
import Image from "next/image";
import PlusButton from "./PlusButton";
import CardText from "./CardText";

const StyledContainer = styled.div`
  background-color: #141414;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  border-radius: 17px;
  width: 242px;
  height: 356px;
  padding: 13px 20px 20px 17px;
  position: relative;
  overflow: hidden;

  &:hover {
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      padding: 1px;
      border-radius: 19px;
      background: linear-gradient(180deg, #f2c754 0%, rgba(242, 199, 84, 0) 100%);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
      z-index: 1;
      pointer-events: none;
    }
  }
`;

const StyledImageWrapper = styled.div`
  width: 100%;
  height: 257px;
  overflow: hidden;
  position: relative;
`;

const ZoomedImage = styled(Image)`
  object-fit: contain;
  transform: scale(1.5);
  height: 100%;
  width: 100%;
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

type Props = {};

const NewProductCard = (props: Props) => {
  return (
    <StyledContainer>
      <StyledImageWrapper>
        <ZoomedImage src="/assets/desktopLampa.svg" alt="light" width={239} height={257} />
      </StyledImageWrapper>
      <StyledActions>
        <CardText name="ეზოს სანათი" price="199,99 ₾" />
        <PlusButton />
      </StyledActions>
    </StyledContainer>
  );
};

export default NewProductCard;
