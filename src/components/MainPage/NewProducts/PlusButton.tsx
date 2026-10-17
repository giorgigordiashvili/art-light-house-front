import React, { useRef } from "react";
import styled from "styled-components";
import Image from "next/image";
import { ProductList } from "@/api/generated/interfaces";
import {
  ecommerceClientCartItemsCreate,
  ecommerceClientCartGetOrCreateRetrieve,
  ecommerceClientCartItemsPartialUpdate,
} from "@/api/generated/api";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { canAddMore, getStockLimit } from "@/utils/stock";
import { showStockLimitToast } from "@/utils/toast";

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

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    &:hover {
      box-shadow: none;
    }
  }
`;

const PlusButton = ({
  product,
  disabled = false,
}: {
  product?: ProductList;
  disabled?: boolean;
}) => {
  const { openAuthModal } = useAuthModal();
  // In-flight guard: a fast double click must not create duplicate cart lines
  const busyRef = useRef(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product || disabled) return;

    // Check if user is authenticated
    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("auth_access_token");
    if (!hasToken) {
      // User is not authenticated - open auth modal instead
      openAuthModal();
      return;
    }

    if (busyRef.current) return;
    busyRef.current = true;
    try {
      // Ensure we have a cart id
      const data = await ecommerceClientCartGetOrCreateRetrieve();
      const normalized = (data as any)?.cart ? (data as any).cart : (data as any);
      const cartId = normalized?.id;
      if (!cartId) return;
      // If already in cart, bump quantity; else create
      const existing = Array.isArray(normalized?.items)
        ? (normalized.items as any[]).find((it: any) => {
            const pid = typeof it.product === "object" ? it.product?.id : it.product;
            return pid === product.id;
          })
        : undefined;

      if (existing) {
        // Never exceed the available stock - tell the user why nothing happened
        if (!canAddMore(product, existing.quantity || 0)) {
          showStockLimitToast(getStockLimit(product));
          return;
        }
        await ecommerceClientCartItemsPartialUpdate(String(existing.id), {
          quantity: (existing.quantity || 0) + 1,
        } as any);
      } else {
        const payload = { cart: cartId, product: product.id, variant: null, quantity: 1 } as any;
        await ecommerceClientCartItemsCreate(payload);
      }
      const cart = await ecommerceClientCartGetOrCreateRetrieve();
      const n = (cart as any)?.cart ? (cart as any).cart : (cart as any);
      try {
        const count = Array.isArray(n?.items)
          ? n.items.reduce((acc: number, it: any) => acc + (it.quantity || 0), 0)
          : 0;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { count, cart: n } }));
        }
      } catch {}
    } catch (err) {
      console.error("Failed to add product to cart", err);
    } finally {
      busyRef.current = false;
    }
  };

  return (
    <StyledButton type="button" onClick={handleClick} data-plus-button="true" disabled={disabled}>
      <Image src={"/assets/BlackPlus.svg"} width={28} height={28} alt="plus-icon" />
    </StyledButton>
  );
};

export default PlusButton;
