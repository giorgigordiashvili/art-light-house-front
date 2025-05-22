import React from "react";
import HeroAndCategory from "@/components/MainPage/HeroAndCategory/HeroAndCategory";
import NewProducts from "./NewProducts/NewProducts";
import PopularProducts from "./PopularProducts/PopularProducts";
import Accomplishments from "./Accomplishments/Accomplishments";
import Contact from "../Contact/Contact";

const MainPage = ({ dictionary }) => {
  return (
    <>
      <HeroAndCategory dictionary={dictionary.hero} />
      <NewProducts />
      <PopularProducts />
      <Accomplishments />
      <Contact variant="2" />
    </>
  );
};

export default MainPage;
