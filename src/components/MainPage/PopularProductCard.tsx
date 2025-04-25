import React from "react";
import styled, { css } from "styled-components";

type Props = {
  image: string;
  label: string;
  width: number;
  isRightAligned?: boolean;
  isMiddleCard?: boolean;
  changeHeightMobile?: boolean;
};

const Card = styled.div<{
  width: number;
  $isMiddleCard?: boolean;
  $isRightAligned?: boolean;
  $changeHeightMobile?: boolean;
}>`
  width: ${({ width }) => width}px;
  height: 332px;
  background-color: #1a1a1a;
  border-radius: 17px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;

  ${({ $isMiddleCard }) =>
    $isMiddleCard &&
    css`
      background-color: #121212;
    `}

  @media (max-width: 1080px) {
    width: 100%;
    ${({ $changeHeightMobile }) =>
      $changeHeightMobile &&
      css`
        height: 228px;
      `}
  }
`;

const Image = styled.img<{ $isRightAligned?: boolean; $isMiddleCard?: boolean }>`
  object-fit: contain;
  position: absolute;
  top: 0;
  ${({ $isRightAligned }) =>
    $isRightAligned &&
    css`
      right: 10px;
      @media (max-width: 1080px) {
        width: 200px;
        height: 200px;
      }
    `}
  ${({ $isMiddleCard }) =>
    $isMiddleCard &&
    css`
      @media (max-width: 1080px) {
        left: 0;
        width: 325px;
        height: 325px;
        top: -5px;
      }
    `}
`;

const LabelWrapper = styled.div`
  position: absolute;
  bottom: 38px;
  left: 38px;
  @media (max-width: 1080px) {
    bottom: 30px;
    left: 30px;
  }
`;

const Label = styled.div`
  color: white;
  font-family: Helvetica;
  font-weight: 400;
  font-size: 24px;
  line-height: 24px;
  @media (max-width: 1080px) {
    font-family: Helvetica;
    font-weight: 400;
    font-size: 20px;
    line-height: 16.48px;
  }
`;

const PopularProductCard = ({
  image,
  label,
  width,
  isRightAligned,
  isMiddleCard,
  changeHeightMobile,
}: Props) => {
  return (
    <Card
      width={width}
      $isMiddleCard={isMiddleCard}
      $isRightAligned={isRightAligned}
      $changeHeightMobile={changeHeightMobile}
    >
      <Image
        src={image}
        alt={label}
        $isRightAligned={isRightAligned}
        $isMiddleCard={isMiddleCard}
      />
      <LabelWrapper>
        <Label>{label}</Label>
      </LabelWrapper>
    </Card>
  );
};

export default PopularProductCard;
