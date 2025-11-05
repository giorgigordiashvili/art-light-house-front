import React from "react";
import Image from "next/image";
import styled from "styled-components";
import { ProductList } from "@/api/generated/interfaces";
import {
  apiEcommerceClientCartItemsCreate,
  apiEcommerceClientCartGetOrCreateRetrieve,
  apiEcommerceClientCartItemsPartialUpdate,
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
      // Ensure we have a cart id
      const data = await apiEcommerceClientCartGetOrCreateRetrieve();
      const normalized = (data as any)?.cart ? (data as any).cart : (data as any);
      const cartId = normalized?.id;
      if (!cartId) return;
      // If already present, increase quantity instead of creating duplicate
      const existing = Array.isArray(normalized?.items)
        ? (normalized.items as any[]).find((it: any) => {
            const pid = typeof it.product === "object" ? it.product?.id : it.product;
            return pid === product.id;
          })
        : undefined;

      if (existing) {
        await apiEcommerceClientCartItemsPartialUpdate(String(existing.id), {
          quantity: (existing.quantity || 0) + 1,
        } as any);
      } else {
        const payload = { cart: cartId, product: product.id, variant: null, quantity: 1 } as any;
        await apiEcommerceClientCartItemsCreate(payload);
      }
      const cart = await apiEcommerceClientCartGetOrCreateRetrieve();
      const n = (cart as any)?.cart ? (cart as any).cart : (cart as any);
      try {
        const count = Array.isArray(n?.items)
          ? n.items.reduce((acc: number, it: any) => acc + (it.quantity || 0), 0)
          : 0;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { count, cart: n } }));
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
