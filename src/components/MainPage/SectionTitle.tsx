import React from "react";
import styled from "styled-components";
import Image from "next/image";

const StyledContainer = styled.div<{ $isCategory: boolean }>`
  display: flex;
  gap: 14px;
  align-items: center;

  @media (max-width: 1292px) {
    padding-inline: ${({ $isCategory }) => ($isCategory ? "20px" : "0")};
  }

  @media (max-width: 1080px) {
    padding-inline: ${({ $isCategory }) => ($isCategory ? "0" : "0")};
  }
`;

const StyledText = styled.div`
  font-family: Helvetica;
  font-weight: 250;
  font-size: 34px;
  line-height: 24px;
  letter-spacing: 0%;
  color: #ffffff;

  @media (max-width: 1080px) {
    font-family: Helvetica;
    font-size: 24px;
  }
`;

type ImageType = "category" | "newProduct" | "family" | "address";

type Props = {
  text: string;
  image: ImageType;
};

const getImageSrc = (type: ImageType) => {
  switch (type) {
    case "category":
      return "/assets/stars.svg";
    case "newProduct":
      return "/assets/newProductsICon.svg";
    case "family":
      return "/assets/home.svg";
    case "address":
      return "/assets/marker.svg";
    default:
      return "";
  }
};

const SectionTitle: React.FC<Props> = ({ text, image }) => {
  const isCategory = image === "category";

  return (
    <StyledContainer $isCategory={isCategory}>
      <Image src={getImageSrc(image)} alt={image} width={32} height={32} />
      <StyledText>{text}</StyledText>
    </StyledContainer>
  );
};

export default SectionTitle;
