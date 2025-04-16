"use client";
import styled from "styled-components";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import AuthorizationModal from "@/components/Header/AuthorizationModal";

const StyledComponent = styled.div`
  background: red;
  height: 1920px;
`;

function HomeScreen() {
  return (
    <>
      <StyledComponent>
        <AuthorizationModal></AuthorizationModal>
      </StyledComponent>
    </>
  );
}

export default HomeScreen;
