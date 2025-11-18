"use client";
import React from "react";
import styled from "styled-components";

const Button = styled.button`
  background-color: #ffcb40;
  color: #000000;
  border: none;
  width: 100%;
  height: 50px;
  border-radius: 10px;
  max-width: 100%;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
`;

interface ButtonFilterProps {
  onClick: () => void;
  dictionary: any;
}

const ButtonFilter: React.FC<ButtonFilterProps> = ({ onClick, dictionary }) => {
  return <Button onClick={onClick}>{dictionary.filter.filterButton}</Button>;
};

export default ButtonFilter;
