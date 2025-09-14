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
  return (
    <StyledComponent>
      <DetailMain dictionary={dictionary} product={null}></DetailMain>
    </StyledComponent>
  );
};

export default MyDetails;
