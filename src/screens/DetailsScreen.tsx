"use client";
import styled from "styled-components";
import DetailMain from "@/components/ProductDetail/DetailMain";

const StyledComponent = styled.div`
  background: #0b0b0b;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MyDetails = ({ dictionary }: { dictionary: any }) => {
  // This is a placeholder - this screen might need to be updated or separated from ProductDetail
  const placeholderProduct: any = null; // No server product provided on this generic screen

  return (
    <StyledComponent>
      <DetailMain dictionary={dictionary} product={placeholderProduct} />
    </StyledComponent>
  );
};

export default MyDetails;
