"use client";
import styled from "styled-components";
import DetailMain from "@/components/ProductDetail/DetailMain";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MyDetails = ({ dictionary }: { dictionary: any }) => {
  // This is a placeholder - this screen might need to be updated or separated from ProductDetail
  const placeholderProductId = 1;

  return (
    <StyledComponent>
      <DetailMain dictionary={dictionary} productId={placeholderProductId}></DetailMain>
    </StyledComponent>
  );
};

export default MyDetails;
