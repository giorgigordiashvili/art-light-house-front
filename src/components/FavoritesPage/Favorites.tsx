"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ContactTitle from "../Contact/ContactTitle";
import FavoriteCard from "./FavoriteCard";
import styled from "styled-components";
import {
  apiEcommerceClientFavoritesList,
  apiEcommerceClientFavoritesDestroy,
} from "@/api/generated/api";
import type { FavoriteProduct } from "@/api/generated/interfaces";
import EmptyFavoritesCard from "@/components/Favorites/EmptyFavoritesCard";

const StyledContainer = styled.div``;

const StyledTitle = styled.div``;

const StyledCards = styled.div`
  max-height: 508px;
  overflow: scroll;
  scrollbar-width: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 117px;
  @media (max-width: 1080px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: none;
    gap: 10px;
    margin-top: 48px;
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

const Favorites = ({ dictionary }: { dictionary: any }) => {
  const [items, setItems] = useState<FavoriteProduct[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const hasToken =
          typeof window !== "undefined" && !!localStorage.getItem("auth_access_token");
        if (!hasToken) {
          if (!mounted) return;
          setItems([]);
          setError(null);
          return;
        }
        const response = await apiEcommerceClientFavoritesList();
        if (!mounted) return;
        setItems(response.results || []);
      } catch (e: any) {
        if (!mounted) return;
        const status = e?.response?.status;
        if (status === 401) {
          setError(null);
          setItems([]);
        } else {
          setError(e?.message || "Failed to load favorites");
          setItems([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();

    // keep in sync if app dispatches favoritesUpdated
    const onFavUpdated = () => fetchData();
    if (typeof window !== "undefined") {
      window.addEventListener("favoritesUpdated", onFavUpdated as EventListener);
    }
    return () => {
      mounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("favoritesUpdated", onFavUpdated as EventListener);
      }
    };
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div style={{ color: "#fff", textAlign: "center", paddingTop: 40 }}>Loading…</div>;
    }
    if (error) {
      return <div style={{ color: "#ff6b6b", textAlign: "center", paddingTop: 40 }}>{error}</div>;
    }
    if (!items.length) {
      return <EmptyFavoritesCard dictionary={dictionary} />;
    }

    return (
      <StyledCards>
        {items.map((fav) => {
          const p: any = (fav as any).product;
          const title = pickLocalized(p?.name) || p?.title || "";
          const priceValue = p?.price || "";
          const price = priceValue ? `${priceValue} ₾` : "";
          const imageSrc = p?.image || "/assets/ProductImageContainer.svg";
          const productId = typeof p === "object" ? Number(p?.id) : Number(p);
          const onRemove = async () => {
            const hasToken =
              typeof window !== "undefined" && !!localStorage.getItem("auth_access_token");
            if (!hasToken) return;
            try {
              const favoriteItem = items.find((f) => {
                const pid =
                  typeof (f as any).product === "object"
                    ? (f as any).product?.id
                    : (f as any).product;
                return Number(pid) === Number(productId);
              });
              if (favoriteItem) {
                await apiEcommerceClientFavoritesDestroy(String(favoriteItem.id));
              }
              setItems((prev) =>
                prev.filter((f) => {
                  const pid =
                    typeof (f as any).product === "object"
                      ? (f as any).product?.id
                      : (f as any).product;
                  return Number(pid) !== Number(productId);
                })
              );
              try {
                if (typeof window !== "undefined") {
                  const remaining = items.filter((f) => {
                    const pid =
                      typeof (f as any).product === "object"
                        ? (f as any).product?.id
                        : (f as any).product;
                    return Number(pid) !== Number(productId);
                  }).length;
                  window.dispatchEvent(
                    new CustomEvent("favoritesUpdated", {
                      detail: { count: remaining, hasAny: remaining > 0 },
                    })
                  );
                }
              } catch {}
            } catch (e: any) {
              if (e?.response?.status === 401) {
                // unauthorized, clear silently
                setItems((prev) => prev);
              }
            }
          };
          const onDetails = () => {
            const seg = (pathname?.split("/")[1] || "").toLowerCase();
            const locale = seg === "en" ? "en" : "ge";
            router.push(`/${locale}/products/${Number(productId)}`);
          };
          return (
            <FavoriteCard
              key={fav.id}
              card="favorite"
              dictionary={dictionary}
              title={title}
              price={price}
              imageSrc={imageSrc}
              onRemove={onRemove}
              onDetails={onDetails}
            />
          );
        })}
      </StyledCards>
    );
  };

  return (
    <StyledContainer>
      <StyledTitle>
        <ContactTitle text={dictionary?.cart?.favorites?.title || "შენახული პროდუქტები"} />
      </StyledTitle>
      {renderContent()}
    </StyledContainer>
  );
};

export default Favorites;
