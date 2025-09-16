import Image from "next/image";
import type React from "react";
import styled from "styled-components";

const StyledAddButton = styled.div`
  position: absolute;
  width: 268px;
  height: 55px;
  background: linear-gradient(
    92.9deg,
    rgba(247, 203, 87, 0.4) 3.7%,
    rgba(216, 177, 70, 0.4) 97.98%
  );
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 342px;
  margin-left: 20px;
  transition: 0.2s ease-in-out;
  @media (max-width: 1080px) {
    width: 154px;
    height: 48px;
    margin-top: 218px;
    margin-left: 8px;
  }
  &:hover {
    /* background-color: #090700; */
    background-color: #030300;
  }
`;

type Props = {
  onClick?: () => void | Promise<void>;
};

const AddButton = ({ onClick, dictionary }: Props & { dictionary?: any }) => {
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) await onClick();
  };

  return (
    <StyledAddButton onClick={handleClick}>
      <Image
        src="/assets/plus.svg"
        alt={dictionary?.products?.addToCartAlt || "დამატება"}
        width={28}
        height={28}
      />
    </StyledAddButton>
  );
};

export default AddButton;
