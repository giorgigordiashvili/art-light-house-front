"use client";
import ProductsMain from "@/components/ListProductCard/ProductsMain";
import { FilterProvider } from "@/contexts/FilterContext";
import styled from "styled-components";
import NewCircle from "@/components/ui/NewCircle";
import Circle from "@/components/ui/Circle";
import BigCircle from "@/components/ui/BigCircle";
import { PaginatedProductListList } from "@/api/generated/interfaces";

const StyledComponent = styled.div`
  background: #0b0b0b;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledCircle = styled.div`
  position: absolute;
  bottom: -1200px;
  left: 38%;
  transform: translateX(-50%);
  @media (max-width: 1080px) {
    display: none;
  }
  @media (min-height: 1150px) {
    display: none;
  }
`;

interface ProductsScreenProps {
  dictionary: any;
  initialProductsData?: PaginatedProductListList | null;
  initialAttributes?: any[] | null;
  initialPage?: number;
}

const ProductsScreen = ({
  dictionary,
  initialProductsData,
  initialAttributes,
  initialPage,
}: ProductsScreenProps) => {
  return (
    <FilterProvider>
      <StyledComponent>
        <ProductsMain
          dictionary={dictionary.products}
          initialProductsData={initialProductsData}
          initialAttributes={initialAttributes}
          initialPage={initialPage}
        />
        <NewCircle size="small" top="1000px" right="142px" media="no" />
        <StyledCircle>
          <Circle size="large" />
        </StyledCircle>
        <BigCircle variant={2} />
      </StyledComponent>
    </FilterProvider>
  );
};

export default ProductsScreen;
