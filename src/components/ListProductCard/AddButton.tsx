import React from "react";
import styled from "styled-components";
import Image from "next/image";

const StyledAddButton = styled.div`
  position: absolute;
  width: 268px;
  height: 55px;
  background: linear-gradient(92.9deg, #f7cb57 3.7%, #d8b146 97.98%);
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
