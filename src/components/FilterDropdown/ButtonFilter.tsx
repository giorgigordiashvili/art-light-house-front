"use client";
import React from "react";
import styled from "styled-components";

const Button = styled.button`
  background-color: #ffcb40;
  color: #000000;
  border: none;
  width: 358px;
  height: 50px;
  border-radius: 10px;
  max-width: 100%;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
`;

interface ButtonFilterProps {
  onClick: () => void;
}

const ButtonFilter: React.FC<ButtonFilterProps> = ({ onClick }) => {
  return <Button onClick={onClick}>გაფილტვრა</Button>;
};

export default ButtonFilter;
