import React from "react";
import { motion } from "framer-motion";
import HeroAndCategory from "@/components/MainPage/HeroAndCategory/HeroAndCategory";
import NewProducts from "./NewProducts/NewProducts";
import PopularProducts from "./PopularProducts/PopularProducts";
import Accomplishments from "./Accomplishments/Accomplishments";
import Contact from "../Contact/Contact";
import type { HomepageSection } from "@/types/homepage";

const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

interface MainPageProps {
  dictionary: any;
  homepageSections: HomepageSection[];
  lang: string;
}

const MainPage = ({ dictionary, homepageSections, lang }: MainPageProps) => {
  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={scaleUp}>
        <HeroAndCategory
          dictionary={{
            ...dictionary.hero,
            ...dictionary.category,
          }}
          homepageSections={homepageSections}
          lang={lang}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <NewProducts dictionary={dictionary.newProducts} />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <PopularProducts
          dictionary={dictionary.popularProducts}
          homepageSections={homepageSections}
          lang={lang}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Accomplishments
          dictionary={dictionary.accomplihsments}
          homepageSections={homepageSections}
          lang={lang}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <Contact
          variant="2"
          dictionary={dictionary.contact}
          homepageSections={homepageSections}
          lang={lang}
        />
      </motion.div>
    </>
  );
};

export default MainPage;
