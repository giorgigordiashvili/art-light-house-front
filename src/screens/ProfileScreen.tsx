"use client";
import styled from "styled-components";
import ProfileMain from "@/components/Profile/ProfileMain";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProfileScreen = () => {
  return (
    <StyledComponent>
      <ProfileMain></ProfileMain>
    </StyledComponent>
  );
};

export default ProfileScreen;
