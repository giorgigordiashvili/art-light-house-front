"use client";
import styled from "styled-components";
import ProfileMain from "@/components/Profile/ProfileMain";
import NewCircle from "@/components/ui/NewCircle";
import LeftCircle from "@/components/ui/LeftCircle";
import Circle from "@/components/ui/Circle";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledCircle = styled.div`
  position: absolute;
  left: 50%;
  top: 200px;
  @media (max-width: 568px) {
    left: 30%;
  }
  @media (max-width: 406px) {
    left: 20%;
  }
  @media (max-width: 355px) {
    left: 15%;
  }
`;

const ProfileScreen = () => {
  return (
    <StyledComponent>
      <NewCircle size="small" top="950px" right="142px" media="no" />
      <LeftCircle size="small" top="850px" left="-140px" />
      <StyledCircle>
        <Circle size="small" />
      </StyledCircle>
      <ProfileMain></ProfileMain>
    </StyledComponent>
  );
};

export default ProfileScreen;
