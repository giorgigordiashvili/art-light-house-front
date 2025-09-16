"use client";
import styled from "styled-components";
import Link from "next/link";
import { useParams } from "next/navigation";

const StyledMenuBar = styled.ul`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 31px 0 52px 0;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
  gap: 28px;

  @media (max-width: 1080px) {
    gap: 14px;
  }
`;

const MenuItem = styled.li`
  max-width: 120px; /* შეზღუდული სიგანე ყველა ელემენტზე */
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  a {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: "Helvetica";
    font-weight: 300;
    font-size: 14px;
    line-height: 20px;
    color: #ffffff;
    text-decoration: none;
    cursor: pointer;
  }

  &:last-child {
    flex-shrink: 0;
    max-width: none; /* ბოლოსთვის არ დავუწეროთ მაქსიმუმი */
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 10px;
  background-color: white;
  flex-shrink: 0;
`;

const MenuBar = ({ dictionary }: { dictionary: any }) => {
  const params = useParams<{ lang?: string }>();
  const rawLang = (params?.lang || "ge").toString();
  const lang = ["ge", "en"].includes(rawLang) ? (rawLang as "ge" | "en") : "ge";
  return (
    <StyledMenuBar>
      <MenuItem>
        <Link href={`/${lang}`}>{dictionary?.productDetails?.navigation?.nav1 || "Home"}</Link>
      </MenuItem>
      <Divider />
      <MenuItem>
        <Link href={`/${lang}/products`}>
          {dictionary?.productDetails?.navigation?.nav2 || "Products"}
        </Link>
      </MenuItem>
      <Divider />
      <MenuItem>
        <Link href="#">{dictionary?.productDetails?.navigation?.nav3 || "Home lights"}</Link>
      </MenuItem>
      <Divider />
      <MenuItem>
        <Link href="#">{dictionary?.productDetails?.navigation?.nav4 || "Lamp model"}</Link>
      </MenuItem>
    </StyledMenuBar>
  );
};

export default MenuBar;
