"use client";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import FavoriteCard from "../FavoritesPage/FavoriteCard";
import ContactTitle from "../Contact/ContactTitle";
import Summary from "./Summary";
import CartProduct from "../Header/CartProduct";
import EmptyCartCard from "../Cart/EmptyCartCard";
import {
  apiEcommerceClientCartGetOrCreateRetrieve,
  apiEcommerceClientCartItemsPartialUpdate,
  apiEcommerceClientCartItemsDestroy,
} from "@/api/generated/api";
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

function pickLocalized(value: any, fallback = ""): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    let lang = "ka";
    if (typeof window !== "undefined") {
      const seg = (window.location.pathname.split("/")[1] || "").toLowerCase();
      lang = seg === "en" ? "en" : "ka";
    }
    return value[lang] || value.en || value.ka || fallback;
  }
  return fallback;
}

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
      const data = await apiEcommerceClientCartGetOrCreateRetrieve();
      const normalized = (data as any)?.cart ? (data as any).cart : (data as any);
      setCart(normalized as Cart);
    } catch {
      setCart({
        id: 0,
        client: 0,
        delivery_address: null as any,
        status: undefined,
        notes: "",
        items: [],
        total_items: 0,
        total_amount: "0",
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
        client: 0,
        delivery_address: null as any,
        status: undefined,
        notes: "",
        items: [],
        total_items: 0,
        total_amount: "0",
        created_at: "",
        updated_at: "",
      } as any);
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  // Keep cart page in sync with external cart changes (e.g., updates from modal)
  useEffect(() => {
    const onCartUpdated = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as { cart?: any };
        if (detail?.cart) {
          const normalized = (detail.cart as any)?.cart ? detail.cart.cart : detail.cart;
          setCart(normalized as Cart);
        } else {
          // fallback: quick refetch
          (async () => {
            try {
              const data = await apiEcommerceClientCartGetOrCreateRetrieve();
              const normalized = (data as any)?.cart ? (data as any).cart : (data as any);
              setCart(normalized as Cart);
            } catch {}
          })();
        }
      } catch {}
    };
    if (typeof window !== "undefined") {
      window.addEventListener("cartUpdated", onCartUpdated as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("cartUpdated", onCartUpdated as EventListener);
      }
    };
  }, []);

  const handleIncrease = async (itemId: number, current: number) => {
    if (!isAuthenticated) return;
    try {
      await apiEcommerceClientCartItemsPartialUpdate(String(itemId), { quantity: current + 1 });
      const updated = await apiEcommerceClientCartGetOrCreateRetrieve();
      const normalized = (updated as any)?.cart ? (updated as any).cart : (updated as any);
      setCart(normalized as Cart);
      try {
        const count =
          normalized.items?.reduce((acc: number, it: any) => acc + (it.quantity || 0), 0) || 0;
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("cartUpdated", { detail: { count, cart: normalized } })
          );
        }
      } catch {}
    } catch {}
  };

  const handleDecrease = async (itemId: number, current: number) => {
    if (!isAuthenticated) return;
    if (current <= 1) {
      await handleRemove(itemId);
      return;
    }
    try {
      await apiEcommerceClientCartItemsPartialUpdate(String(itemId), { quantity: current - 1 });
      const updated = await apiEcommerceClientCartGetOrCreateRetrieve();
      const normalized = (updated as any)?.cart ? (updated as any).cart : (updated as any);
      setCart(normalized as Cart);
      try {
        const count =
          normalized.items?.reduce((acc: number, it: any) => acc + (it.quantity || 0), 0) || 0;
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("cartUpdated", { detail: { count, cart: normalized } })
          );
        }
      } catch {}
    } catch {}
  };

  const handleRemove = async (itemId: number) => {
    if (!isAuthenticated) return;
    try {
      await apiEcommerceClientCartItemsDestroy(String(itemId));
      const updated = await apiEcommerceClientCartGetOrCreateRetrieve();
      const normalized = (updated as any)?.cart ? (updated as any).cart : (updated as any);
      setCart(normalized as Cart);
      try {
        const count =
          normalized.items?.reduce((acc: number, it: any) => acc + (it.quantity || 0), 0) || 0;
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("cartUpdated", { detail: { count, cart: normalized } })
          );
        }
      } catch {}
    } catch {}
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
                  title={pickLocalized(it.product?.name)}
                  price={`${it.product?.price ?? it.price_at_add} ₾`}
                  quantity={it.quantity || 1}
                  imageSrc={it.product?.image || ""}
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
                  title={pickLocalized(it.product?.name)}
                  price={`${it.product?.price ?? it.price_at_add} ₾`}
                  quantity={it.quantity || 1}
                  imageSrc={it.product?.image || ""}
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
                price: `${cart?.total_amount ?? "0"} ₾`,
              }}
              cart={cart}
            />
          </StyledSummary>
        ) : null}
      </StyledWrapper>
    </StyledContainer>
  );
};

export default Cart;
