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
`;

const Item = styled.div<{ logout?: boolean }>`
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
    color: #ffcb40;
  }
  &:hover {
    filter: brightness(0) saturate(100%) invert(67%) sepia(81%) saturate(360%) hue-rotate(5deg)
      brightness(104%) contrast(102%);
  }
  ${({ logout }) =>
    logout
      ? `
        margin-top: 24px;
        margin-bottom: 24px;
        color: #ff4d4f;
      `
      : `
        margin-top: 24px;
        margin-bottom: 24px;
      `}
`;

const Divider = styled.div<{ last?: string }>`
  height: 1px;
  background-color: #242424;
  margin-top: ${(props) => (props.last === "true" ? "105px" : "0")};
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  position: relative;
  flex-shrink: 0;
  transition: filter 0.3s ease;
`;

const menuItems = [
  { label: "ჩემი დეტალები", icon: "/assets/icons/Details.svg" },
  { label: "ჩემი მისამართები", icon: "/assets/icons/misamarti.svg" },
  { label: "ჩემი შეკვეთები", icon: "/assets/icons/Shekvetebi.svg" },
  { label: "გადახდის მეთოდები", icon: "/assets/icons/gadaxda.svg" },
  { label: "პარამეტრები", icon: "/assets/icons/settings.svg" },
];

const DetailBar = () => {
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
      <Divider last="true" />
      <Item logout={true}>
        <IconWrapper>
          <Image src="/assets/icons/Logout.svg" alt="გასვლა" width={24} height={24} />
        </IconWrapper>
        გასვლა
      </Item>
    </Container>
  );
};

export default DetailBar;
