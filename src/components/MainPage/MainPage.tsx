import React from "react";
import HeroAndCategory from "@/components/MainPage/HeroAndCategory/HeroAndCategory";
import NewProducts from "./NewProducts/NewProducts";
import PopularProducts from "./PopularProducts/PopularProducts";
import Accomplishments from "./Accomplishments/Accomplishments";
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
