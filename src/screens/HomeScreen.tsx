"use client";
import styled from "styled-components";
import MainPage from "@/components/MainPage/MainPage";
import BigCircle from "@/components/ui/BigCircle";
import type { HomepageSection } from "@/types/homepage";
import type { ProductList } from "@/api/generated/interfaces";

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
  lang: string;
  initialFeaturedProducts?: ProductList[];
}

const HomeScreen = ({
  dictionary,
  homepageSections,
  lang,
  initialFeaturedProducts,
}: HomeScreenProps) => {
  return (
    <StyledComponent>
      <BigCircle variant={1} />
      <MainPage
        dictionary={dictionary}
        homepageSections={homepageSections}
        lang={lang}
        initialFeaturedProducts={initialFeaturedProducts}
      />
    </StyledComponent>
  );
};

export default HomeScreen;
