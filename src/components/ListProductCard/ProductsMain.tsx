"use client";
import FilterSidebar from "@/components/FilterSidebar/FilterSidebar";
import CardGrid from "@/components/ListProductCard/CardGrid";
import styled from "styled-components";
// import SortButton from "@/components/Sort/SortButtom";
import FilterButton from "@/components/FilterSidebar/FilterButtom";
import SortDropdown from "@/components/Sort/SortDropdown";
import Container from "@/components/ui/Container";

const StyledComponent = styled.div`
  background: black;
  height: auto;
  display: flex;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-family: "Helvetica Neue LT GEO";
  font-weight: 250;
  font-size: 64px;
  line-height: 33.8px;
  color: white;
  margin-top: 167px;
  margin-bottom: 54px;

  @media (max-width: 1080px) {
    font-size: 34px;
    line-height: 24px;
    margin-bottom: 47px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
`;

const SortWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 18px;
  @media (max-width: 1080px) {
    justify-content: space-between;
  }
`;

const OnMobile = styled.div`
  display: none;

  @media (max-width: 1080px) {
    display: block;
  }
`;

const OnDesktop = styled.div`
  @media (max-width: 1080px) {
    display: none;
  }
`;

function ProductsMain() {
  return (
    <StyledComponent>
      <Container>
        <PageTitle>პროდუქტები</PageTitle>

        <SortWrapper>
          <OnMobile>
            <FilterButton />
          </OnMobile>
          <SortDropdown />
        </SortWrapper>
        <ContentWrapper>
          <OnDesktop>
            <FilterSidebar />
          </OnDesktop>
          <CardGrid />
        </ContentWrapper>
      </Container>
    </StyledComponent>
  );
}

export default ProductsMain;
