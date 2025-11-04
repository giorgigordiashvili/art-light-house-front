import React from "react";
import Image from "next/image";
import styled from "styled-components";
import { ProductList } from "@/api/generated/interfaces";
import {
  apiEcommerceClientCartItemsCreate,
  apiEcommerceClientCartGetOrCreateRetrieve,
} from "@/api/generated/api";
import { useAuthModal } from "@/contexts/AuthModalContext";

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
  onClick?: () => void;
};

const AddButton = ({
  onClick,
  product,
  dictionary,
}: Props & { product: ProductList; dictionary?: any }) => {
  const { openAuthModal } = useAuthModal();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if user is authenticated
    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("auth_access_token");
    if (!hasToken) {
      // User is not authenticated - open auth modal instead
      openAuthModal();
      return;
    }

    try {
      const payload = { product: product.id, quantity: 1 };
      await apiEcommerceClientCartItemsCreate(payload);
      const cart = await apiEcommerceClientCartGetOrCreateRetrieve();
      try {
        const count = Array.isArray(cart?.items)
          ? cart.items.reduce((acc: number, it: any) => acc + (it.quantity || 0), 0)
          : 0;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { count, cart } }));
        }
      } catch {}
      onClick?.();
    } catch {}
  };

  return (
    <StyledAddButton onClick={handleClick} data-add-button="true">
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
