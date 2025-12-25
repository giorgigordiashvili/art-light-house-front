"use client";
import styled from "styled-components";
import ProfileMain from "@/components/Profile/ProfileMain";
import NewCircle from "@/components/ui/NewCircle";
import LeftCircle from "@/components/ui/LeftCircle";
import Circle from "@/components/ui/Circle";
import BigCircle from "@/components/ui/BigCircle";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const StyledComponent = styled.div`
  background: #0b0b0b;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  /* justify-content: center; */
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

const ProfileScreen = ({ dictionary }: any) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <StyledComponent>
        <BigCircle variant={2} />
      </StyledComponent>
    );
  }

  return (
    <StyledComponent>
      <BigCircle variant={2} />
      <NewCircle size="small" top="950px" right="142px" media="no" />
      <LeftCircle size="small" top="850px" left="-140px" />
      <StyledCircle>
        <Circle size="small" />
      </StyledCircle>
      <ProfileMain dictionary={dictionary}></ProfileMain>
    </StyledComponent>
  );
};

export default ProfileScreen;
