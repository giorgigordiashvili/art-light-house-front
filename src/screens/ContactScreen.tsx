"use client";
import styled from "styled-components";
import Contact from "@/components/Contact/Contact";
import NewCircle from "@/components/ui/NewCircle";
import LeftCircle from "@/components/ui/LeftCircle";
import Circle from "@/components/ui/Circle";
import BigCircle from "@/components/ui/BigCircle";

const StyledComponent = styled.div`
  background: #0b0b0b;
  padding-bottom: 130px;
  padding-top: 186px;
  @media (max-width: 1080px) {
    padding-top: 162px;
    padding-bottom: 0;
  }
`;

const StyledCircle = styled.div`
  position: absolute;
  left: 44%;
  top: 210px;
  transform: translateX(-50%);
  z-index: 1;
  @media (max-width: 1080px) {
    display: none;
  }
`;

interface ContactScreenProps {
  dictionary: any;
  homepageSections?: any[];
  lang?: string;
}

const ContactScreen = ({ dictionary, homepageSections, lang }: ContactScreenProps) => {
  return (
    <StyledComponent>
      <Contact
        variant="1"
        dictionary={dictionary.contact}
        homepageSections={homepageSections}
        lang={lang}
      />
      <BigCircle variant={2} />
      <NewCircle size="small" right="142px" top="1000px" />
      <LeftCircle size="small" left="-200px" top="900px" media="yes" />
      <StyledCircle>
        <Circle size="small" />
      </StyledCircle>
    </StyledComponent>
  );
};

export default ContactScreen;
