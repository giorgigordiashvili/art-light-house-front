"use client";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import CartProduct from "./CartProduct";
import PrimaryButton from "../Buttons/PrimaryButton";
import SummaryPrice from "./SummaryPrice";
import EmptyCartModal from "./EmptyCartModal";
import {
  apiEcommerceClientCartGetOrCreateRetrieve,
  apiEcommerceClientCartItemsPartialUpdate,
  apiEcommerceClientCartItemsDestroy,
} from "@/api/generated/api";
import type { Cart } from "@/api/generated/interfaces";
import { useAuth } from "@/contexts/AuthContext";

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
  margin-top: 19px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  overflow-y: overlay;
  max-height: 242px;
  box-sizing: border-box;
  scrollbar-width: none;
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

const CartModal = ({ onClose, dictionary }: Props) => {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await apiEcommerceClientCartGetOrCreateRetrieve();
      setCart(data);
    } catch {
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

  const handleRedirect = (e?: React.MouseEvent) => {
    if (e && (e.ctrlKey || e.metaKey)) {
      // Ctrl+click or Cmd+click - open in new tab
      const pathname = typeof window !== "undefined" ? window.location.pathname : "";
      const locale = pathname.split("/")[1] || "ge";
      window.open(`/${locale}/cart`, "_blank");
      onClose();
      return;
    }
    router.push("/cart");
    onClose();
  };

  const handleRedirectMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) {
      // Middle mouse button
      e.preventDefault();
      const pathname = typeof window !== "undefined" ? window.location.pathname : "";
      const locale = pathname.split("/")[1] || "ge";
      window.open(`/${locale}/cart`, "_blank");
      onClose();
    }
  };

  const totalPrice = useMemo(() => {
    if (!cart?.items) return 0;
    const sum = cart.total_price;
    return sum;
  }, [cart]);

  const totalItems = useMemo(() => {
    if (!cart?.items) return 0;
    // total_items comes as string, but we can calculate from items as well
    const sum = cart.items.reduce((acc, it) => acc + (it.quantity || 0), 0);
    return sum;
  }, [cart]);

  const isEmpty = useMemo(() => {
    return !loading && (!cart?.items || cart.items.length === 0);
  }, [loading, cart]);

  const handleIncrease = async (itemId: number, current: number) => {
    try {
      await apiEcommerceClientCartItemsPartialUpdate(String(itemId), { quantity: current + 1 });
      const updated = await apiEcommerceClientCartGetOrCreateRetrieve();
      setCart(updated);
      try {
        const count = updated.items?.reduce((acc, it) => acc + (it.quantity || 0), 0) || 0;
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("cartUpdated", { detail: { count, cart: updated } })
          );
        }
      } catch {}
    } catch {
    } finally {
    }
  };

  const handleDecrease = async (itemId: number, current: number) => {
    if (current <= 1) {
      await handleRemove(itemId);
      return;
    }
    try {
      await apiEcommerceClientCartItemsPartialUpdate(String(itemId), { quantity: current - 1 });
      const updated = await apiEcommerceClientCartGetOrCreateRetrieve();
      setCart(updated);
      try {
        const count = updated.items?.reduce((acc, it) => acc + (it.quantity || 0), 0) || 0;
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("cartUpdated", { detail: { count, cart: updated } })
          );
        }
      } catch {}
    } catch {
    } finally {
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await apiEcommerceClientCartItemsDestroy(String(itemId));
      const updated = await apiEcommerceClientCartGetOrCreateRetrieve();
      setCart(updated);
      try {
        const count = updated.items?.reduce((acc, it) => acc + (it.quantity || 0), 0) || 0;
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("cartUpdated", { detail: { count, cart: updated } })
          );
        }
      } catch {}
    } catch {
    } finally {
    }
  };

  return (
    <ModalLayoutWrapper>
      <ModalLayout>
        {isEmpty ? (
          <EmptyCartModal dictionary={dictionary} />
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
                        title={it.product_details?.title}
                        price={`${it.product_details?.price} ₾`}
                        quantity={it.quantity || 1}
                        imageSrc={it.product_details?.primary_image}
                        onIncrease={() => handleIncrease(it.id, it.quantity || 1)}
                        onDecrease={() => handleDecrease(it.id, it.quantity || 1)}
                        onRemove={() => handleRemove(it.id)}
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
