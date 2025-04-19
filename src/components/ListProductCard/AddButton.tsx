import React from "react";
import styled from "styled-components";
import Image from "next/image";

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
  @media (max-width: 1080px) {
    width: 154px;
    height: 48px;
    margin-top: 218px;
    margin-left: 8px;
  }
`;

type Props = {
  onClick?: () => void;
};

const AddButton = ({ onClick }: Props) => {
  return (
    <StyledAddButton onClick={onClick}>
      <Image src="/assets/plus.svg" alt="Plus Icon" width={28} height={28} />
    </StyledAddButton>
  );
};

export default AddButton;
