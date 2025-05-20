import React from "react";
import styled from "styled-components";
import Container from "../../ui/Container";
import ProductTitle from "./ProductTitle";
import Circle from "@/components/ui/Circle";
import { useLanguage } from "@/context/LanguageContext";

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 44px 0 0 0;
  @media (max-width: 1080px) {
    padding: 26px 0 0 0;
  }
`;

const StyledCircle = styled.div`
  position: absolute;
  top: 80px;
  left: 272px;
`;

const ScrollableWrapper = styled.div`
  @media (max-width: 1332px) {
    overflow-x: auto;
    scrollbar-width: none;
  }
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: max-content;
  @media (max-width: 1292px) {
    padding-inline: 20px;
  }
  @media (max-width: 1080px) {
    padding-inline: 0;
  }
  @media (max-width: 522px) {
    gap: 10px;
  }
`;

const Row = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isSecond",
})<{ isSecond?: boolean }>`
  display: flex;
  gap: 19px;

  ${(props) => props.isSecond && "height: 223px;"}

  @media (max-width: 578px) {
    ${(props) => props.isSecond && "height: auto;"}
    gap: 10px;
  }
`;

const Card = styled.div<{
  width: number;
  height: number;
  gradient?: string;
  $backgroundImage?: string;
}>`
  position: relative;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background-color: #101010;
  border-radius: 32px;
  padding: 38px;
  color: white;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  backdrop-filter: blur(114px);
  z-index: 0;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: 32px;
    background: ${(props) => props.gradient || "transparent"};
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: 1;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url(${(props) => props.$backgroundImage || "none"});
    background-repeat: no-repeat;
    background-position: right;
    background-size: contain;
    z-index: 0;
    transition: transform 0.2s ease;
  }

  &:hover::after {
    transform: scale(1.1);
  }

  &:hover {
    box-shadow: 0 0 0 0.5px #ffcb40;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  @media (max-width: 522px) {
    padding: 16px;

    .first-row & {
      width: 154px !important;
      height: 92px !important;
    }

    .second-row & {
      &:nth-child(1) {
        width: 210px !important;
        height: 92px !important;
      }

      &:nth-child(2) {
        width: 154px !important;
        height: 92px !important;
      }

      &:nth-child(3) {
        width: 98px !important;
        height: 92px !important;
      }
    }

    &::after {
      background-size: 70%;
    }
  }
`;

const CategorySection = () => {
  const { dictionary } = useLanguage();
  return (
    <Container>
      <StyledContainer>
        <StyledCircle>
          <Circle size="medium" />
        </StyledCircle>
        <ScrollableWrapper>
          <RowWrapper>
            <Row className="first-row">
              <Card
                width={374}
                height={222}
                gradient="linear-gradient(116.95deg, rgba(255, 255, 255, 0.03) 3.48%, rgba(246, 202, 86, 0.45) 98.94%)"
                $backgroundImage="/assets/light.png"
              >
                <ProductTitle text={dictionary.category.light} />
              </Card>
              <Card
                width={374}
                height={222}
                gradient="linear-gradient(240.36deg, rgba(255, 255, 255, 0.03) 1.87%, rgba(246, 202, 86, 0.45) 93.88%)"
                $backgroundImage="/assets/PillarLight.png"
              >
                <ProductTitle text={dictionary.category.gardenLight} />
              </Card>
              <Card width={505} height={222} $backgroundImage="/assets/furniture.png">
                <ProductTitle text={dictionary.category.furniture} />
              </Card>
            </Row>

            <Row isSecond className="second-row">
              <Card
                width={505}
                height={222}
                gradient="linear-gradient(79.22deg, rgba(255, 255, 255, 0.03) 2.74%, rgba(246, 202, 86, 0.45) 81.45%)"
                $backgroundImage="/assets/decorations.png"
              >
                <ProductTitle text={dictionary.category.decorations} />
              </Card>
              <Card
                width={374}
                height={222}
                gradient="linear-gradient(330deg, rgba(255, 255, 255, 0.03) 3.22%, rgba(246, 202, 86, 0.45) 97.55%)"
                $backgroundImage="/assets/moon.png"
              >
                <ProductTitle text={dictionary.category.decorates} />
              </Card>
              <Card width={374} height={222} $backgroundImage="/assets/stars.svg">
                <ProductTitle text={dictionary.category.mirror} />
              </Card>
            </Row>
          </RowWrapper>
        </ScrollableWrapper>
      </StyledContainer>
    </Container>
  );
};

export default CategorySection;
