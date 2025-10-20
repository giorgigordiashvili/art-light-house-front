import React from "react";
import styled from "styled-components";
import TrashIcon from "./TrashIcon";
import QuantitySelector from "./QuantitySelector";
import ProductContent from "./ProductContent";

const StyledContainer = styled.div`
  width: 325px;
  height: 116px;
  border-radius: 17px;
  background-color: #1a1a1a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  z-index: 1;
  @media (max-width: 1080px) {
    width: 100%;
  }
`;

const StyledTrashButton = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
`;

type Props = {
  dictionary?: any;
  title: string;
  price: string;
  quantity: number;
  imageSrc?: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

const CartProduct = ({
  dictionary,
  title,
  price,
  quantity,
  imageSrc,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) => {
  return (
    <StyledContainer>
      <StyledTrashButton onClick={onRemove}>
        <TrashIcon />
      </StyledTrashButton>
      <ProductContent dictionary={dictionary} title={title} price={price} imageSrc={imageSrc} />
      <QuantitySelector quantity={quantity} onIncrease={onIncrease} onDecrease={onDecrease} />
    </StyledContainer>
  );
};

export default CartProduct;
