"use client";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import ProductContent from "./ProductContent";
import PrimaryButton from "../Buttons/PrimaryButton";
import {
  apiEcommerceClientFavoritesList,
  apiEcommerceClientFavoritesDestroy,
} from "@/api/generated/api";
import type { FavoriteProduct } from "@/api/generated/interfaces";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import TrashIcon from "./TrashIcon";

type Props = {
  onClose: () => void;
  dictionary: any;
};

const StyledContainer = styled.div<{ $isEmpty: boolean }>`
  width: 349px;
  height: ${({ $isEmpty }) => ($isEmpty ? "300px" : "415px")};
  display: flex;
  flex-direction: column;
  justify-content: ${({ $isEmpty }) => ($isEmpty ? "center" : "space-between")};
  position: fixed;
  top: 99px;
  background-color: #1a1a1a96;
  backdrop-filter: blur(114px);
  border: 1px solid #ffffff12;
  border-radius: 17px;
  padding: 0;
  z-index: 1001;
  padding-bottom: 16px;

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

  @media (max-width: 1080px) {
    margin-inline: 12px;
  }
`;

const ProductWrapper = styled.div`
  width: 325px;
  height: 116px;
  border-radius: 17px;
  background-color: #1a1a1a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  flex-shrink: 0;
  position: relative;
  @media (max-width: 1080px) {
    width: 100%;
    padding-inline: 12px;
  }
`;

const ContentPadding = styled.div`
  padding: 15px 0 0 15px;
`;

const StyledButton = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  @media (max-width: 1080px) {
    padding-inline: 16px;
  }
`;

const StyledDivider = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const StyledTrashButton = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  z-index: 10;
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

const FavoritesModal = ({ onClose, dictionary }: Props) => {
  const router = useRouter();
  const [items, setItems] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const hasToken = typeof window !== "undefined" && !!localStorage.getItem("auth_access_token");
      if (!hasToken) {
        setItems([]);
        return;
      }
      const response = await apiEcommerceClientFavoritesList();
      setItems(response.results || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    fetchFavorites();
  }, [isAuthenticated]);

  useEffect(() => {
    const onFavUpdated = () => fetchFavorites();
    if (typeof window !== "undefined") {
      window.addEventListener("favoritesUpdated", onFavUpdated as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("favoritesUpdated", onFavUpdated as EventListener);
      }
    };
  }, []);

  const count = useMemo(() => items.length, [items]);
  const isEmpty = count === 0;

  const handleRedirect = (e?: React.MouseEvent) => {
    if (e && (e.ctrlKey || e.metaKey)) {
      // Ctrl+click or Cmd+click - open in new tab
      const pathname = typeof window !== "undefined" ? window.location.pathname : "";
      const locale = pathname.split("/")[1] || "ge";
      window.open(`/${locale}/favorites`, "_blank");
      onClose();
      return;
    }
    router.push("/favorites");
    onClose();
  };

  const handleRedirectMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) {
      // Middle mouse button
      e.preventDefault();
      const pathname = typeof window !== "undefined" ? window.location.pathname : "";
      const locale = pathname.split("/")[1] || "ge";
      window.open(`/${locale}/favorites`, "_blank");
      onClose();
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      // Find the favorite item to get its ID
      const favoriteItem = items.find((item) => {
        const pid =
          typeof (item as any).product === "object"
            ? (item as any).product?.id
            : (item as any).product;
        return Number(pid) === Number(productId);
      });
      if (favoriteItem) {
        await apiEcommerceClientFavoritesDestroy(String(favoriteItem.id));
      }
      // Update local state immediately
      setItems((prev) =>
        prev.filter((item) => {
          const pid =
            typeof (item as any).product === "object"
              ? (item as any).product?.id
              : (item as any).product;
          return Number(pid) !== Number(productId);
        })
      );
      // Dispatch event to update other components
      if (typeof window !== "undefined") {
        const remaining = items.filter((i) => {
          const pid =
            typeof (i as any).product === "object" ? (i as any).product?.id : (i as any).product;
          return Number(pid) !== Number(productId);
        }).length;
        window.dispatchEvent(
          new CustomEvent("favoritesUpdated", {
            detail: { count: remaining, hasAny: remaining > 0 },
          })
        );
      }
    } catch {}
  };

  return (
    <ModalLayoutWrapper>
      <ModalLayout>
        <StyledContainer $isEmpty={isEmpty}>
          <StyledDivider>
            {!isEmpty && (
              <StyledSpanContainer>
                <StyledSpan>
                  {count} {dictionary?.cart?.cartModal?.itemCount}
                </StyledSpan>
              </StyledSpanContainer>
            )}
            <ProductList>
              {!loading && items?.length ? (
                items.map((fav) => {
                  const p: any = (fav as any).product;
                  const productId = typeof p === "object" ? p?.id : p;
                  const title = pickLocalized(p?.name) || p?.title || "";
                  const priceValue = p?.price || "";
                  const price = priceValue ? `${priceValue} ₾` : "";
                  const imageSrc = p?.image || "/assets/ProductImageContainer.svg";
                  return (
                    <ProductWrapper key={fav.id}>
                      <StyledTrashButton onClick={() => handleRemove(Number(productId))}>
                        <TrashIcon />
                      </StyledTrashButton>
                      <ContentPadding>
                        <ProductContent
                          dictionary={dictionary}
                          title={title}
                          price={price}
                          imageSrc={imageSrc}
                        />
                      </ContentPadding>
                    </ProductWrapper>
                  );
                })
              ) : (
                <div
                  style={{
                    color: "#8e8e8e",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <Image
                    src="/assets/FavoriteIcon.svg"
                    width={70}
                    height={70}
                    alt={"empty-favorites"}
                  />
                  {loading ? "იტვირთება..." : dictionary?.cart?.emptyCart?.subTitle}
                </div>
              )}
            </ProductList>
          </StyledDivider>
          {!isEmpty && (
            <StyledButton onClick={handleRedirect} onMouseDown={handleRedirectMouseDown}>
              <PrimaryButton
                text={dictionary?.cart?.favorites?.button || "დეტალურად"}
                height="50px"
                width="317px"
                media="full"
              />
            </StyledButton>
          )}
        </StyledContainer>
      </ModalLayout>
    </ModalLayoutWrapper>
  );
};

export default FavoritesModal;
