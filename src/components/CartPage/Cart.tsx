"use client";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import FavoriteCard from "../FavoritesPage/FavoriteCard";
import ContactTitle from "../Contact/ContactTitle";
import Summary from "./Summary";
import CartProduct from "../Header/CartProduct";
import EmptyCartCard from "../Cart/EmptyCartCard";
import { cartGet, cartRemoveItem, cartUpdateItem } from "@/api/generated/api";
import type { Cart } from "@/api/generated/interfaces";
import { useAuth } from "@/contexts/AuthContext";

const StyledContainer = styled.div``;

const StyledCards = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "hasItems",
})<{ hasItems: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 71px;

  ${({ hasItems }) =>
    hasItems
      ? css`
          max-height: 508px;
          overflow: scroll;
        `
      : css`
          width: 100%;
          max-height: none;
          overflow: visible;
        `}

  scrollbar-width: none;

  @media (max-width: 1080px) {
    gap: 10px;
    margin-top: 48px;
    ${({ hasItems }) =>
      hasItems
        ? css`
            max-height: 242px;
            overflow: scroll;
          `
        : css`
            max-height: none;
            overflow: visible;
          `}
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 31px;
  }
`;

const StyledSummary = styled.div`
  margin-top: 71px;
  @media (max-width: 1080px) {
    margin-top: 0;
  }
`;

const Cart = ({ dictionary }: any) => {
  const [isMobile, setIsMobile] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1080);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartGet();
      setCart(data);
    } catch (e) {
      console.error("Failed to fetch cart", e);
      setCart({
        id: 0,
        items: [],
        total_items: "0",
        total_price: "0",
        created_at: "",
        updated_at: "",
      } as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setCart({
        id: 0,
        items: [],
        total_items: "0",
        total_price: "0",
        created_at: "",
        updated_at: "",
      } as any);
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  const handleIncrease = async (itemId: number, current: number) => {
    if (!isAuthenticated) return;
    try {
      const updated = await cartUpdateItem(itemId, { quantity: current + 1 });
      setCart(updated);
    } catch (e) {
      console.error("Failed to increase quantity", e);
    }
  };

  const handleDecrease = async (itemId: number, current: number) => {
    if (!isAuthenticated) return;
    if (current <= 1) {
      await handleRemove(itemId);
      return;
    }
    try {
      const updated = await cartUpdateItem(itemId, { quantity: current - 1 });
      setCart(updated);
    } catch (e) {
      console.error("Failed to decrease quantity", e);
    }
  };

  const handleRemove = async (itemId: number) => {
    if (!isAuthenticated) return;
    try {
      const updated = await cartRemoveItem(itemId);
      setCart(updated);
    } catch (e) {
      console.error("Failed to remove item", e);
    }
  };

  return (
    <StyledContainer>
      <ContactTitle text={dictionary?.cart?.cart?.title} />
      <StyledWrapper>
        <StyledCards hasItems={Boolean(cart?.items?.length)}>
          {loading ? null : cart?.items?.length ? (
            !isMobile ? (
              cart.items.map((it) => (
                <FavoriteCard
                  key={it.id}
                  card="cart"
                  dictionary={dictionary}
                  title={it.product_details?.title}
                  price={`${it.product_details?.price} ₾`}
                  quantity={it.quantity || 1}
                  onIncrease={() => handleIncrease(it.id, it.quantity || 1)}
                  onDecrease={() => handleDecrease(it.id, it.quantity || 1)}
                  onRemove={() => handleRemove(it.id)}
                />
              ))
            ) : (
              cart.items.map((it) => (
                <CartProduct
                  key={it.id}
                  dictionary={dictionary}
                  title={it.product_details?.title}
                  price={`${it.product_details?.price} ₾`}
                  quantity={it.quantity || 1}
                  onIncrease={() => handleIncrease(it.id, it.quantity || 1)}
                  onDecrease={() => handleDecrease(it.id, it.quantity || 1)}
                  onRemove={() => handleRemove(it.id)}
                />
              ))
            )
          ) : (
            <EmptyCartCard dictionary={dictionary.cart} />
          )}
        </StyledCards>
        {cart?.items?.length ? (
          <StyledSummary>
            <Summary
              dictionary={{
                ...dictionary.cart.cart,
                price: `${cart?.total_price ?? "0"} ₾`,
              }}
            />
          </StyledSummary>
        ) : null}
      </StyledWrapper>
    </StyledContainer>
  );
};

export default Cart;
