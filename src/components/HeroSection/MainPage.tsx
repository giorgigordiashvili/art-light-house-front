import React from "react";
import HeroAndCategory from "@/components/HeroSection/HeroAndCategory";
import NewProducts from "@/components/HeroSection/NewProducts";
import PopularProducts from "./PopularProducts";
import Accomplishments from "./Accomplishments";
import Contact from "../Contact/Contact";

const MainPage = () => {
  return (
    <>
      <HeroAndCategory />
      <NewProducts />
      <PopularProducts />
      <Accomplishments />
      <Contact variant="2" />
    </>
  );
};

export default MainPage;
