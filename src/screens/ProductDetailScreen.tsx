"use client";
import styled from "styled-components";
import DetailMain from "@/components/ProductDetail/DetailMain";
import BigCircle from "@/components/ui/BigCircle";

const StyledComponent = styled.div`
  background: #0b0b0b;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface ProductDetailScreenProps {
  dictionary: any;
  initialProduct: any; // Using any to avoid broad refactors; ideally import ProductDetail type
  initialError?: string | null;
}

const ProductDetailScreen = ({
  dictionary,
  initialProduct,
  initialError,
}: ProductDetailScreenProps) => {
  return (
    <StyledComponent>
      <BigCircle variant={2} />
      <DetailMain dictionary={dictionary} product={initialProduct} error={initialError} />
    </StyledComponent>
  );
};

export default ProductDetailScreen;
