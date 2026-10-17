"use client";
import styled from "styled-components";
import Image from "next/image";

const Wrapper = styled.div`
  width: 100%;
  max-width: 100%;
  background-color: transparent;

  @media (min-width: 1081px) {
    display: none;
  }
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #1a1a1a96;
  backdrop-filter: blur(114px);
  border-radius: 16px;
  border: 1px solid #ffffff12;
  cursor: pointer;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;

  span {
    background: linear-gradient(90deg, #f7cb57 0%, #ffd700 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
    font-size: 14px;
    line-height: 28px;
  }

  img {
    filter: brightness(0) saturate(100%) invert(67%) sepia(81%) saturate(360%) hue-rotate(5deg)
      brightness(104%) contrast(102%);
  }
`;

const HeaderRight = styled.div<{ open: boolean }>`
  transition: transform 0.3s ease;
  transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0deg)")};
`;

type Props = {
  dictionary: any;
  open: boolean;
  onToggle: () => void;
};

// Header only: the single <Order> instance lives in OrderMain and is shown/hidden with CSS,
// so toggling the dropdown does not remount it and refetch the orders.
const MobileOrderDropdown = ({ dictionary, open, onToggle }: Props) => {
  return (
    <Wrapper>
      <DropdownHeader onClick={onToggle}>
        <HeaderLeft>
          <Image src="/assets/icons/Shekvetebi.svg" alt={dictionary.title} width={24} height={24} />
          <span>{dictionary.title}</span>
        </HeaderLeft>
        <HeaderRight open={open}>
          <Image
            src="/assets/icons/Dropdown Icon.svg"
            alt="Dropdown Arrow"
            width={24}
            height={24}
          />
        </HeaderRight>
      </DropdownHeader>
    </Wrapper>
  );
};

export default MobileOrderDropdown;
