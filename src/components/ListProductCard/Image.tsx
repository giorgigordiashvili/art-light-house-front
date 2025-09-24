import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Desktoplampa from "../../../public/assets/desktopLampa.svg";
import mobilelampa from "../../../public/assets/mobileLampa.svg";
import { ProductList } from "@/api/generated/interfaces";

const StyledLampaImage = styled.div`
  position: absolute;
  width: 309px;
  height: 218px;
  top: 30px;
  left: -1px;

  @media (max-width: 1080px) {
    width: 129.24px;
    height: 129.24px;
    left: 20px;
    top: 17px;
  }
`;

const DesktopOnlyIcons = styled.div`
  display: block;

  @media (max-width: 1080px) {
    display: none;
  }
`;

const MobileOnlyIcons = styled.div`
  display: none;

  @media (max-width: 1080px) {
    display: block;
  }
`;

const LampaImage = ({ product }: { product: ProductList }) => {
  // Extract image URL from primary_image object
  const imageUrl =
    product.primary_image && typeof product.primary_image === "object"
      ? (product.primary_image as any).image
      : product.primary_image;

  // Check if we have a valid primary image (not null, undefined, or empty string)
  const hasValidImage = imageUrl && typeof imageUrl === "string" && imageUrl.trim() !== "";

  return (
    <StyledLampaImage>
      <MobileOnlyIcons>
        {hasValidImage ? (
          <Image src={imageUrl} alt={product.title} layout="fill" objectFit="contain" priority />
        ) : (
          <Image src={mobilelampa} alt="Mobile Lampa" layout="fill" objectFit="contain" priority />
        )}
      </MobileOnlyIcons>
      <DesktopOnlyIcons>
        {hasValidImage ? (
          <Image src={imageUrl} alt={product.title} layout="fill" objectFit="contain" priority />
        ) : (
          <Image
            src={Desktoplampa}
            alt="Desktop Lampa"
            layout="fill"
            objectFit="contain"
            priority
          />
        )}
      </DesktopOnlyIcons>
    </StyledLampaImage>
  );
};

export default LampaImage;
