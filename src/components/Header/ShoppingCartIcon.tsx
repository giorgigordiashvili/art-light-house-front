import React from "react";
import styled from "styled-components";
import CartIcon from "@/app/icons/CartIcon";

const StyledContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

const StyledCount = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2.4px 5.7px;
  font-size: 14px;
  font-weight: 700;
  line-height: 100%;
  text-align: center;
`;

type Props = {
  itemCount?: number;
  onClick?: () => void;
  color?: string;
};

const ShoppingCartIcon = ({ itemCount = 0, onClick, color }: Props) => {
  return (
    <StyledContainer onClick={onClick}>
      <CartIcon color={color} />
      {itemCount > 0 && <StyledCount>{itemCount}</StyledCount>}
    </StyledContainer>
  );
};

export default ShoppingCartIcon;
