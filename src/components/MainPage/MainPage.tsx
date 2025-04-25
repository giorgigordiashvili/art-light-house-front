import React from "react";
import HeroAndCategory from "@/components/MainPage/HeroAndCategory/HeroAndCategory";
// import NewProducts from "@/components/MainPage/NewProducts/NewProducts";
import NewProducts from "./NewProducts";
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
