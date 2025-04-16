"use client";
import styled from "styled-components";
import Logo from "@/components/Logo";

const Description = styled.div`
  width: 479px;
  height: 143px;
  left: 80px;
`;
const DescriptionText = styled.p`
  color: #ffffff;
  margin-top: 21.18px;
  font-family: Helvetica Neue LT GEO;
  font-weight: 300;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
`;
function FooterDescription() {
  return (
    <Description>
      <Logo size="large" />
      <DescriptionText>
        ჩვენი განათება ქმნის განსაკუთრებულ გარემოს, რომელიც ვიზუალურად მიმზიდველია და ემოციურ
        გამოცდილებას ქმნის.
      </DescriptionText>
    </Description>
  );
}

export default FooterDescription;
