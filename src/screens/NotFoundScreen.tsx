"use client";

import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import geDict from "../../dictionaries/ge.json";
import enDict from "../../dictionaries/en.json";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0b0b0b;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`;

const Code = styled.h1`
  font-family: HelRom, Helvetica, Arial, sans-serif;
  font-weight: 800;
  font-size: 160px;
  line-height: 1;
  margin: 0;
  color: #ffcb40;

  @media (max-width: 1080px) {
    font-size: 96px;
  }
`;

const Message = styled.p`
  font-family: Helvetica, Arial, sans-serif;
  font-size: 18px;
  line-height: 26px;
  color: #ffffff;
  opacity: 0.88;
  margin: 0;
`;

const Btn = styled(Link)`
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 10px;
  background: #ffcb40;
  color: #000;
  font-family: HelRom, Helvetica, Arial, sans-serif;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  transition:
    box-shadow 0.2s ease-in-out,
    transform 0.1s ease-in-out;

  &:hover {
    box-shadow: 0 10px 30px -10px rgba(255, 203, 64, 0.6);
  }
  &:active {
    transform: translateY(1px);
  }
`;

export default function NotFoundScreen() {
  const pathname = usePathname();
  const seg = pathname?.split("/")[1];
  const lang: "ge" | "en" = seg === "en" ? "en" : "ge";

  const dict = lang === "en" ? (enDict as any) : (geDict as any);
  const homeHref = `/${lang}`;
  const message =
    dict?.notFound?.message ||
    (lang === "en" ? "the page has not been found" : "გვერდი ვერ მოიძებნა");
  const buttonText =
    dict?.notFound?.button || (lang === "en" ? "Back to main page" : "დაბრუნება მთავარზე");

  return (
    <Wrapper>
      <Inner>
        <Code>404</Code>
        <Message>{message}</Message>
        <Btn href={homeHref}>{buttonText}</Btn>
      </Inner>
    </Wrapper>
  );
}
