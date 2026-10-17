"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { usePathname, useRouter } from "next/navigation";
import CartProduct from "./CartProduct";
import PrimaryButton from "../Buttons/PrimaryButton";
import SummaryPrice from "./SummaryPrice";
import EmptyCartModal from "./EmptyCartModal";
import {
  ecommerceClientCartGetOrCreateRetrieve,
  ecommerceClientCartItemsPartialUpdate,
  ecommerceClientCartItemsDestroy,
} from "@/api/generated/api";
import { canAddMore, getStockLimit } from "@/utils/stock";
import { showStockLimitToast } from "@/utils/toast";
import type { Cart } from "@/api/generated/interfaces";
import { useAuth } from "@/contexts/AuthContext";
import { i18n } from "@/config/i18n";

type Props = {
  itemCount?: number; // deprecated, will be overridden by API data
  onClose: () => void;
  dictionary: any;
};

const StyledContainer = styled.div<{ $isEmpty: boolean }>`
  width: 349px;
  height: ${({ $isEmpty }) => ($isEmpty ? "300px" : "415px")};
  display: flex;
  flex-direction: column;
  /* justify-content: ${({ $isEmpty }) => ($isEmpty ? "center" : "space-between")}; */
  position: fixed;
  top: 99px;
  background-color: #1a1a1a96;
  backdrop-filter: blur(114px);
  border: 1px solid #ffffff12;
  border-radius: 17px;
  padding: 0;
  z-index: 1001;
  padding-bottom: ${({ $isEmpty }) => ($isEmpty ? "0" : "16px")};

  @media (max-width: 1332px) {
    right: 20px;
  }

  @media (max-width: 1080px) {
    right: 0;
    width: 100%;
    bottom: 0;
    top: auto;
    border-radius: 0;
    border-top-left-radius: 17px;
    border-top-right-radius: 17px;
  }
`;

const StyledSpanContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-top: 20px;
  padding-left: 20px;
`;

const StyledSpan = styled.span`
  color: #fff;
  display: flex;
  font-family: Helvetica;
  font-weight: 500;
  font-size: 16px;
  line-height: 14px;
  letter-spacing: 0%;
  vertical-align: middle;
`;

const ModalLayoutWrapper = styled.div`
  width: 100%;
  margin: auto;
`;

const ModalLayout = styled.div`
  width: 1292px;
  display: flex;
  justify-content: flex-end;
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  overflow-y: auto;
  max-height: 242px;
  box-sizing: border-box;
  margin: 19px 4px 0 6px;

  /* Webkit scrollbar styling */
  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #5a5a5a;
  }
`;

const ProductWrapper = styled.div`
  flex-shrink: 0;
  @media (max-width: 1080px) {
    width: 100%;
    padding-inline: 12px;
  }
`;

const StyledButton = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  @media (max-width: 1080px) {
    padding-inline: 16px;
  }
`;

const StyledCartContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const StyledCardWrapper = styled.div``;

const StyledButtonAndSummaryWrapper = styled.div``;

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

const CartModal = ({ onClose, dictionary }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const localeSegment = pathname?.split("/")[1];
  const lang = (i18n.locales as readonly string[]).includes(localeSegment ?? "")
    ? localeSegment
    : i18n.defaultLocale;
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  // Per-item in-flight guard so rapid clicks don't send stale quantities
  const pendingRef = useRef<Set<number>>(new Set());
  // Request sequence counter so out-of-order cart responses are ignored
  const seqRef = useRef(0);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const mySeq = ++seqRef.current;
      const data = await ecommerceClientCartGetOrCreateRetrieve();
      if (mySeq !== seqRef.current) return;
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

  // Keep modal in sync with external cart changes
  useEffect(() => {
    const onCartUpdated = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as { cart?: any };
        if (detail?.cart) {
          const normalized = (detail.cart as any)?.cart ? detail.cart.cart : detail.cart;
          setCart(normalized as Cart);
        } else {
          // fallback refetch
          fetchCart();
        }
      } catch {
        fetchCart();
      }
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

  const handleRedirect = (e?: React.MouseEvent) => {
    if (e && (e.ctrlKey || e.metaKey)) {
      // Ctrl+click or Cmd+click - open in new tab
      window.open(`/${lang}/cart`, "_blank");
      onClose();
      return;
    }
    router.push(`/${lang}/cart`);
    onClose();
  };

  const handleRedirectMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) {
      // Middle mouse button
      e.preventDefault();
      window.open(`/${lang}/cart`, "_blank");
      onClose();
    }
  };

  const totalPrice = useMemo(() => {
    if (!cart) return "0";
    return cart.total_amount || "0";
  }, [cart]);

  const totalItems = useMemo(() => {
    if (!cart) return 0;
    // Prefer backend-provided total_items (number); fallback to sum of quantities
    if (typeof cart.total_items === "number") return cart.total_items;
    return cart.items?.reduce((acc, it) => acc + (it.quantity || 0), 0) || 0;
  }, [cart]);

  // Treat "no data yet" as loading so the empty state never flashes on open
  const isLoading = loading || cart === null;

  const isEmpty = useMemo(() => {
    return !isLoading && (!cart?.items || cart.items.length === 0);
  }, [isLoading, cart]);

  const refreshCart = async () => {
    const mySeq = ++seqRef.current;
    const updated = await ecommerceClientCartGetOrCreateRetrieve();
    if (mySeq !== seqRef.current) return;
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
  };

  const resyncCart = async () => {
    try {
      await refreshCart();
    } catch {}
  };

  const runItemAction = async (itemId: number, fn: () => Promise<void>) => {
    if (pendingRef.current.has(itemId)) return;
    pendingRef.current.add(itemId);
    try {
      await fn();
    } finally {
      pendingRef.current.delete(itemId);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await ecommerceClientCartItemsDestroy(String(itemId));
      await refreshCart();
    } catch {
      await resyncCart();
    }
  };

  const handleIncrease = (itemId: number, current: number) =>
    runItemAction(itemId, async () => {
      const item = cart?.items?.find((it) => it.id === itemId);
      if (item && !canAddMore(item.product, current)) {
        showStockLimitToast(getStockLimit(item.product));
        return;
      }
      try {
        await ecommerceClientCartItemsPartialUpdate(String(itemId), { quantity: current + 1 });
        await refreshCart();
      } catch {
        await resyncCart();
      }
    });

  const handleDecrease = (itemId: number, current: number) =>
    runItemAction(itemId, async () => {
      if (current <= 1) {
        await removeItem(itemId);
        return;
      }
      try {
        await ecommerceClientCartItemsPartialUpdate(String(itemId), { quantity: current - 1 });
        await refreshCart();
      } catch {
        await resyncCart();
      }
    });

  const handleRemove = (itemId: number) => runItemAction(itemId, () => removeItem(itemId));

  return (
    <ModalLayoutWrapper>
      <ModalLayout>
        {isEmpty ? (
          <EmptyCartModal dictionary={dictionary} />
        ) : cart === null ? (
          <StyledContainer $isEmpty={false} />
        ) : (
          <StyledContainer $isEmpty={isEmpty}>
            <StyledCartContent>
              <StyledCardWrapper>
                <StyledSpanContainer>
                  <StyledSpan>
                    {totalItems} {dictionary?.cart?.cartModal.itemCount}
                  </StyledSpan>
                </StyledSpanContainer>
                <ProductList>
                  {cart?.items?.map((it) => (
                    <ProductWrapper key={it.id}>
                      <CartProduct
                        dictionary={dictionary}
                        title={pickLocalized(it.product?.name)}
                        price={`${it.product?.price ?? it.price_at_add} ₾`}
                        quantity={it.quantity || 1}
                        imageSrc={it.product?.image || ""}
                        onIncrease={() => handleIncrease(it.id, it.quantity || 1)}
                        onDecrease={() => handleDecrease(it.id, it.quantity || 1)}
                        onRemove={() => handleRemove(it.id)}
                        canIncrease={canAddMore(it.product, it.quantity || 1)}
                      />
                    </ProductWrapper>
                  ))}
                </ProductList>
              </StyledCardWrapper>
              <StyledButtonAndSummaryWrapper>
                <SummaryPrice dictionary={dictionary} text={`${totalPrice}`} />
                <StyledButton onClick={handleRedirect} onMouseDown={handleRedirectMouseDown}>
                  <PrimaryButton
                    text={dictionary?.cart?.cartModal.button}
                    height="50px"
                    width="317px"
                    media="full"
                  />
                </StyledButton>
              </StyledButtonAndSummaryWrapper>
            </StyledCartContent>
          </StyledContainer>
        )}
      </ModalLayout>
    </ModalLayoutWrapper>
  );
};

export default CartModal;
