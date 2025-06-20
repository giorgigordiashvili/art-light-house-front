"use client";
import styled from "styled-components";
import Container from "@/components/SuccsessOrder/SuccessMain";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SuccsessOrder = ({ dictionary }: { dictionary: any }) => {
  return (
    <StyledComponent>
      <Container dictionary={dictionary} />
    </StyledComponent>
  );
};

export default SuccsessOrder;
