import React from "react";
import HeroAndCategory from "@/components/MainPage/HeroAndCategory/HeroAndCategory";
import NewProducts from "./NewProducts/NewProducts";
import PopularProducts from "./PopularProducts/PopularProducts";
import Accomplishments from "./Accomplishments/Accomplishments";
import Contact from "../Contact/Contact";

const MainPage = ({ dictionary }: any) => {
  return (
    <>
      <HeroAndCategory dictionary={dictionary.hero} />
      <NewProducts dictionary={dictionary.newProducts} />
      <PopularProducts dictionary={dictionary.popularProducts} />
      <Accomplishments dictionary={dictionary.accomplihsments} />
      <Contact variant="2" dictionary={dictionary.contact} />
    </>
  );
};

export default MainPage;
