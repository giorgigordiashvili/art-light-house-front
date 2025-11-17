// import React from "react";
// import styled from "styled-components";
// import Image from "next/image";
// import PlusButton from "./PlusButton";
// import CardText from "./CardText";

// const StyledContainer = styled.div`
//   background-color: #141414;
//   border: 1px solid #ffffff12;
//   backdrop-filter: blur(114px);
//   border-radius: 17px;
//   width: 242px;
//   height: 356px;
//   padding: 13px 20px 20px 17px;
//   position: relative;
//   overflow: hidden;
//   cursor: pointer;
//   @media (max-width: 1080px) {
//     padding: 10px 15px 15px 12px;
//   }

//   &:hover {
//     &::before {
//       content: "";
//       position: absolute;
//       inset: 0;
//       padding: 1px;
//       border-radius: 19px;
//       background: linear-gradient(180deg, #f2c754 0%, rgba(242, 199, 84, 0) 100%);
//       -webkit-mask:
//         linear-gradient(#fff 0 0) content-box,
//         linear-gradient(#fff 0 0);
//       -webkit-mask-composite: destination-out;
//       mask-composite: exclude;
//       z-index: 1;
//       pointer-events: none;
//     }
//   }
// `;

// const StyledImageWrapper = styled.div`
//   width: 100%;
//   height: 257px;
//   overflow: hidden;
//   position: relative;
// `;

// const ZoomedImage = styled(Image)`
//   object-fit: contain;
//   transform: scale(1.5);
//   height: 100%;
//   width: 100%;
// `;

// const StyledActions = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-top: 9px;
//   @media (max-width: 1080px) {
//     margin-top: 17px;
//   }
// `;

// const NewProductCard = () => {
//   return (
//     <StyledContainer>
//       <StyledImageWrapper>
//         <ZoomedImage src="/assets/desktopLampa.svg" alt="light" width={239} height={257} />
//       </StyledImageWrapper>
//       <StyledActions>
//         <CardText name="ეზოს სანათი" price="199,99 ₾" />
//         <PlusButton />
//       </StyledActions>
//     </StyledContainer>
//   );
// };

// export default NewProductCard;

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import PlusButton from "./PlusButton";
import CardText from "./CardText";
import { ProductList } from "@/api/generated/interfaces";
import { usePathname, useRouter } from "next/navigation";
import ProductHeartIcon from "@/components/ListProductCard/ProductHeartIcon";
import { getLocaleFromPath } from "@/utils/getLocaleFromPath";

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
  transition: 0.3s ease;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 177px;
    height: 261px;
    padding: 10px 15px 15px 12px;
  }

  &:hover {
    transform: translateY(-5px);
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      padding: 1px;
      border-radius: 19px;
      background: linear-gradient(180deg, #f2c754 0%, rgba(242, 199, 84, 0) 100%);
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
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

const NewProductCard = ({ product }: { product: ProductList; dictionary: any }) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  const language = getLocaleFromPath(pathname);
  const locale = (pathname?.split("/")[1] || "ge").toLowerCase();

  // Use image field from ProductList interface
  const imageUrl = product.image;

  // Check if we have a valid image URL
  const hasValidImage = imageUrl && typeof imageUrl === "string" && imageUrl.trim() !== "";

  // Get product name based on current language
  const getProductName = () => {
    if (typeof product.name === "string") {
      return product.name;
    }
    if (product.name && typeof product.name === "object") {
      // Map 'ge' to 'ka' for Georgian language
      const langKey = language === "ge" ? "ka" : language;
      return (product.name as any)[langKey] || product.name.en || "";
    }
    return "";
  };

  const productName = getProductName();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-plus-button]")) {
      return;
    }

    // Check for Ctrl+click (Windows/Linux) or Cmd+click (Mac) or middle-click
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      window.open(`/${locale}/products/${product.id}`, "_blank");
      return;
    }

    router.push(`/${locale}/products/${product.id}`);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Handle middle-click (mouse wheel click)
    if (e.button === 1) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-plus-button]")) {
        e.preventDefault(); // Prevent default middle-click behavior
        window.open(`/${locale}/products/${product.id}`, "_blank");
      }
    }
  };

  return (
    <StyledContainer onClick={handleCardClick} onMouseDown={handleMouseDown}>
      <StyledImageWrapper>
        {hasValidImage ? (
          <ZoomedImage
            src={imageUrl}
            alt={productName || "Product"}
            width={isMobile ? 175 : 239}
            height={isMobile ? 188 : 257}
            draggable="false"
          />
        ) : (
          <ZoomedImage
            src="/assets/desktopLampa.svg"
            alt="Default light"
            width={isMobile ? 175 : 239}
            height={isMobile ? 188 : 257}
            draggable="false"
          />
        )}
      </StyledImageWrapper>
      <StyledActions>
        <ProductHeartIcon productId={product.id} />
        <CardText name={productName} price={`${product.price} ₾`} />
        <PlusButton product={product} />
      </StyledActions>
    </StyledContainer>
  );
};

export default NewProductCard;
