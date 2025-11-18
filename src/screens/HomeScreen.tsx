"use client";
import styled from "styled-components";
import MainPage from "@/components/MainPage/MainPage";
import BigCircle from "@/components/ui/BigCircle";
import type { HomepageSection } from "@/types/homepage";

const StyledComponent = styled.div`
  background: #0b0b0b;
  min-height: 100dvh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

interface HomeScreenProps {
  dictionary: any;
  homepageSections: HomepageSection[];
}

const HomeScreen = ({ dictionary, homepageSections }: HomeScreenProps) => {
  return (
    <StyledComponent>
      <BigCircle variant={1} />
      <MainPage dictionary={dictionary} homepageSections={homepageSections} />
    </StyledComponent>
  );
};

export default HomeScreen;
