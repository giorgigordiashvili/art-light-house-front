import React from "react";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import { ProductList } from "@/api/generated/interfaces";
import { getLocaleFromPath } from "@/utils/getLocaleFromPath";

const TextWrapper = styled.div`
  position: absolute;
  top: 273px;
  left: 20px;
  @media (max-width: 1080px) {
    font-size: 14px;
    top: 167px;
    left: 10px;
  }
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
  @media (max-width: 1080px) {
    height: 14px;
    gap: 6px;
  }
`;

const PriceText = styled.div`
  font-family: "Helvetica", sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0%;
  color: white;
  @media (max-width: 1080px) {
    font-size: 14px;
    line-height: 14px;
  }
`;

const OldPriceText = styled.div`
  font-family: "Helvetica", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
  color: #ffffff80;
  text-decoration: line-through;
  @media (max-width: 1080px) {
    font-size: 12px;
    line-height: 14px;
  }
`;

const DescriptionText = styled.div`
  width: auto;
  height: 24px;
  margin-top: 5px;
  font-family: "Helvetica", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
  color: white;
  @media (max-width: 1080px) {
    font-size: 14px;
    margin-top: 7px;
    height: 14px;
  }
`;

const ProductText = ({ product }: { product: ProductList }) => {
  const pathname = usePathname();
  const language = getLocaleFromPath(pathname);

  // Check if product is on sale
  const isOnSale = product.compare_at_price && product.compare_at_price > product.price;

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

  return (
    <TextWrapper>
      <PriceWrapper>
        <PriceText>{product.price} ₾</PriceText>
        {isOnSale && <OldPriceText>{product.compare_at_price} ₾</OldPriceText>}
      </PriceWrapper>
      <DescriptionText>{productName}</DescriptionText>
    </TextWrapper>
  );
};

export default ProductText;
