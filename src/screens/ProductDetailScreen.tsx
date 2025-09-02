"use client";
import styled from "styled-components";
import DetailMain from "@/components/ProductDetail/DetailMain";
import { Product } from "@/lib/productService";
import BigCircle from "@/components/ui/BigCircle";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProductDetailScreen = ({
  dictionary,
  product,
}: {
  dictionary: any;
  product: Product | null;
}) => {
  return (
    <StyledComponent>
      <BigCircle variant={2} />
      <DetailMain dictionary={dictionary} product={product} />
    </StyledComponent>
  );
};

export default ProductDetailScreen;
