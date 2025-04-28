"use client";
import styled from "styled-components";
import DetailBar from "@/components/DetailBar/DetailBar";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MyDetails = () => {
  return (
    <StyledComponent>
      <DetailBar />
    </StyledComponent>
  );
};

export default MyDetails;
