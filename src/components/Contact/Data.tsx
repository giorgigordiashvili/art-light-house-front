import React from "react";
import styled, { css } from "styled-components";
import Image from "next/image";
import DividerDot from "./DividerDot";

const StyledContainer = styled.div`
  display: flex;
  gap: 13px;
  color: #fff;
  padding: 30px 0 18px 13px;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const StyledImageWrapper = styled.div`
  position: relative;
  top: 6px;
  flex-shrink: 0;
`;

const StyledData = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: nowrap;
  overflow: hidden;
`;

const StyledDot = styled.div`
  position: relative;
  top: 2px;
  flex-shrink: 0;
`;

const StyledFirstData = styled.p.withConfig({
  shouldForwardProp: (prop) => prop !== "isBold",
})<{ isBold?: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  font-size: 16px;
  line-height: 32px;
  letter-spacing: -0.6%;
  color: #fafafa;

  ${({ isBold }) =>
    isBold
      ? css`
          font-family: "Helvetica";
          font-weight: 700;
          line-height: 28px;
          letter-spacing: 0%;
        `
      : css`
          font-family: Helvetica;
          font-weight: 400;
        `}
`;

const StyledSecondData = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
  font-family: Helvetica;
  font-weight: 400;
  font-size: 16px;
  line-height: 32px;
  letter-spacing: -0.6%;
  color: #fafafa;
`;

const StyledTitle = styled.p`
  font-family: Helvetica;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0%;
  color: #ffffffcc;
`;

type Props = {
  image: "address" | "phone" | "time";
  title: string;
  data: string;
  secondData?: string;
  withDivider?: boolean;
  boldData?: boolean;
};

const getIconPath = (type: Props["image"]) => {
  switch (type) {
    case "address":
      return "/assets/AddressIcon.svg";
    case "phone":
      return "/assets/PhoneIcon.svg";
    case "time":
      return "/assets/ClockIcon.svg";
    default:
      return "/assets/PhoneIcon.svg";
  }
};

const Data = ({ image, title, data, secondData, withDivider, boldData = false }: Props) => {
  return (
    <StyledContainer>
      <StyledImageWrapper>
        <Image src={getIconPath(image)} width={24} height={24} alt={`${image}-icon`} />
      </StyledImageWrapper>
      <StyledTextWrapper>
        <StyledTitle>{title}</StyledTitle>
        <StyledData>
          <StyledFirstData isBold={boldData}>{data}</StyledFirstData>
          {secondData && withDivider && (
            <StyledDot>
              <DividerDot />
            </StyledDot>
          )}
          {secondData && <StyledSecondData>{secondData}</StyledSecondData>}
        </StyledData>
      </StyledTextWrapper>
    </StyledContainer>
  );
};

export default Data;
