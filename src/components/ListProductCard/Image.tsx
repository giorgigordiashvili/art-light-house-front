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
  // Check if we have a valid primary image (not null, undefined, or empty string)
  const hasValidImage =
    product.primary_image &&
    typeof product.primary_image === "string" &&
    product.primary_image.trim() !== "";

  return (
    <StyledLampaImage>
      <MobileOnlyIcons>
        {hasValidImage ? (
          <Image
            src={product.primary_image}
            alt={product.title}
            layout="fill"
            objectFit="contain"
            priority
          />
        ) : (
          <Image src={mobilelampa} alt="Mobile Lampa" layout="fill" objectFit="contain" priority />
        )}
      </MobileOnlyIcons>
      <DesktopOnlyIcons>
        {hasValidImage ? (
          <Image
            src={product.primary_image}
            alt={product.title}
            layout="fill"
            objectFit="contain"
            priority
          />
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
