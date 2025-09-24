import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { ProductList, AddToCartRequest } from "@/api/generated/interfaces";
import { cartAddItem } from "@/api/generated/api";

const StyledButton = styled.button`
  width: 55px;
  height: 55px;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(92.9deg, #f7cb57 3.7%, #d8b146 97.98%);
  cursor: pointer;
  transition: 0.2s ease-in-out;
  @media (max-width: 1080px) {
    width: 40px;
    height: 40px;
  }

  &:hover {
    box-shadow: 0px 14px 32.8px -8px #f7cb576e;
  }
`;

const PlusButton = ({ product }: { product?: ProductList }) => {
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;
    try {
      const payload: AddToCartRequest = { product_id: product.id, quantity: 1 };
      const cart = await cartAddItem(payload);
      try {
        const count = Array.isArray(cart?.items)
          ? cart.items.reduce((acc: number, it: any) => acc + (it.quantity || 0), 0)
          : 0;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { count, cart } }));
        }
      } catch {}
    } catch (error) {
      console.error("❌ Failed to add to cart", error);
    }
  };

  return (
    <StyledButton onClick={handleClick} data-plus-button="true">
      <Image src={"/assets/BlackPlus.svg"} width={28} height={28} alt="plus-icon" />
    </StyledButton>
  );
};

export default PlusButton;
