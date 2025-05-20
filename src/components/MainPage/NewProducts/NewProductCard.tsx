import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import PlusButton from "./PlusButton";
import CardText from "./CardText";
import { useLanguage } from "@/context/LanguageContext";

const useIsMobile = (breakpoint = 1080) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

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
  cursor: pointer;

  @media (max-width: 768px) {
    width: 177px;
    height: 261px;
    padding: 10px 15px 15px 12px;
  }

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

  @media (max-width: 768px) {
    height: 175px;
  }
`;

const ZoomedImage = styled(Image)`
  object-fit: contain;
  width: 100%;
  height: 100%;
  transform: scale(1.5);
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 9px;

  @media (max-width: 768px) {
    margin-top: 17px;
  }
`;

const NewProductCard = () => {
  const { dictionary } = useLanguage();
  const isMobile = useIsMobile();
  return (
    <StyledContainer>
      <StyledImageWrapper>
        <ZoomedImage
          src={isMobile ? "/assets/desktopLampa.svg" : "/assets/desktopLampa.svg"}
          alt="light"
          width={isMobile ? 175 : 239}
          height={isMobile ? 188 : 257}
        />
      </StyledImageWrapper>
      <StyledActions>
        <CardText name={dictionary.newProducts.light1} price="199,99 ₾" />
        <PlusButton />
      </StyledActions>
    </StyledContainer>
  );
};

export default NewProductCard;
