import React from "react";
import styled from "styled-components";
import Image from "next/image";
import SelectorTitle from "./SelectorTitle";

const StyledContainer = styled.div`
  width: 460px;
  height: 59px;
  border: 1px solid #474748;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 38px;
  padding-right: 49px;
`;

const StyledItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
`;

type Props = {};

const PlaceSelector = (props: Props) => {
  return (
    <StyledContainer>
      <StyledItemWrapper>
        <Image src={"/assets/home.svg"} width={24} height={24} alt="home" />
        <SelectorTitle text="სახლი" />
      </StyledItemWrapper>
      <StyledItemWrapper>
        <Image src={"/assets/briefcase.svg"} width={24} height={24} alt="work" />
        <SelectorTitle text="სამსახური" />
      </StyledItemWrapper>
      <StyledItemWrapper>
        <Image src={"/assets/pin.svg"} width={24} height={24} alt="other" />
        <SelectorTitle text="სხვა" />
      </StyledItemWrapper>
    </StyledContainer>
  );
};

export default PlaceSelector;
