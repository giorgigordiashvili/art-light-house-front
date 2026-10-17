import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Desktoplampa from "../../../public/assets/desktopLampa.webp";
import mobilelampa from "../../../public/assets/mobileLampa.webp";
import { ProductList } from "@/api/generated/interfaces";

const StyledLampaImage = styled.div<{ $dimmed?: boolean }>`
  position: absolute;
  width: 309px;
  height: 218px;
  top: 30px;
  left: -1px;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.35 : 1)};
  filter: ${({ $dimmed }) => ($dimmed ? "grayscale(1)" : "none")};
  transition: opacity 0.2s ease-in-out;

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

const LampaImage = ({
  product,
  priority = false,
  dimmed = false,
}: {
  product: ProductList;
  priority?: boolean;
  dimmed?: boolean;
}) => {
  // Use image field from ProductList interface
  const imageUrl = product.image;

  // Check if we have a valid image (not null, undefined, or empty string)
  const hasValidImage = imageUrl && typeof imageUrl === "string" && imageUrl.trim() !== "";

  // Get product name for alt text (name is translatable, could be string or object)
  const altText = typeof product.name === "string" ? product.name : "Product";

  // Single image for real products (one download, responsive sizes) instead of a
  // CSS-hidden mobile/desktop pair that doubled requests and priority preloads
  if (hasValidImage) {
    return (
      <StyledLampaImage $dimmed={dimmed}>
        <Image
          src={imageUrl}
          alt={altText}
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 1080px) 130px, 309px"
          priority={priority}
          draggable="false"
        />
      </StyledLampaImage>
    );
  }

  // Fallback placeholders use different crops per breakpoint; not preloaded
  return (
    <StyledLampaImage $dimmed={dimmed}>
      <MobileOnlyIcons>
        <Image
          src={mobilelampa}
          alt="Mobile Lampa"
          fill
          style={{ objectFit: "contain" }}
          sizes="130px"
          draggable="false"
        />
      </MobileOnlyIcons>
      <DesktopOnlyIcons>
        <Image
          src={Desktoplampa}
          alt="Desktop Lampa"
          fill
          style={{ objectFit: "contain" }}
          sizes="309px"
          draggable="false"
        />
      </DesktopOnlyIcons>
    </StyledLampaImage>
  );
};

export default LampaImage;
