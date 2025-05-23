"use client";
import styled from "styled-components";
import Image from "next/image";

const Container = styled.div`
  width: 472px;
  height: 544px;
  background: #1a1a1a96;
  backdrop-filter: blur(114px);
  border: 1px solid #ffffff12;
  border-radius: 17px;
  color: #edededcc;
  font-family: inherit;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1;
  @media (max-width: 1080px) {
    display: none;
  }
`;

// არ გადაეცემა logout როგორც DOM prop
const Item = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "logout",
})<{ logout?: boolean }>`
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  padding: 0 24px;
  height: 24px;
  color: ${({ logout }) => (logout ? "#FF4D4F" : "#edededcc")};
  &:hover {
    background: linear-gradient(90deg, #f7cb57 0%, #ffd700 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: brightness(0) saturate(100%) invert(67%) sepia(81%) saturate(360%) hue-rotate(5deg)
      brightness(104%) contrast(102%);
  }
  margin-top: 24px;
  margin-bottom: 24px;
`;

// არ გადაეცემა last როგორც DOM prop
const Divider = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "last",
})<{ last?: boolean }>`
  height: 1px;
  background-color: #242424;
  margin-top: ${({ last }) => (last ? "105px" : "0")};
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  position: relative;
  flex-shrink: 0;
  transition: filter 0.3s ease;
`;

const DetailBar = ({ dictionary }: any) => {
  const menuItems = [
    { label: dictionary.detailBar1, icon: "/assets/icons/Details.svg" },
    { label: dictionary.detailBar2, icon: "/assets/icons/misamarti.svg" },
    { label: dictionary.detailBar3, icon: "/assets/icons/Shekvetebi.svg" },
    { label: dictionary.detailBar4, icon: "/assets/icons/gadaxda.svg" },
    { label: dictionary.detailBar5, icon: "/assets/icons/settings.svg" },
  ];

  return (
    <Container>
      {menuItems.map(({ label, icon }, index) => (
        <div key={label}>
          {index !== 0 && <Divider />}
          <Item>
            <IconWrapper>
              <Image src={icon} alt={label} width={24} height={24} />
            </IconWrapper>
            {label}
          </Item>
        </div>
      ))}
      <Divider last />
      <Item logout>
        <IconWrapper>
          <Image
            src="/assets/icons/Logout.svg"
            alt={dictionary.detailBar6}
            width={24}
            height={24}
          />
        </IconWrapper>
        {dictionary.detailBar6}
      </Item>
    </Container>
  );
};

export default DetailBar;
