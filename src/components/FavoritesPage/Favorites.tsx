"use client";
import React, { useEffect, useState } from "react";
import ContactTitle from "../Contact/ContactTitle";
import FavoriteCard from "./FavoriteCard";
import styled from "styled-components";
import { favoritesList, favoritesRemove } from "@/api/generated/api";
import type { Favorite } from "@/api/generated/interfaces";
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

const Favorites = ({ dictionary }: { dictionary: any }) => {
  const [items, setItems] = useState<Favorite[]>([]);
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
        const data = await favoritesList();
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
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
          const pd: any = fav.product_details as any;
          const title = pd?.title || "";
          const priceValue = pd?.price || "";
          const price = priceValue ? `${priceValue} ₾` : "";
          const primary = pd?.primary_image;
          const imageSrc =
            typeof primary === "string"
              ? primary
              : primary?.image || "/assets/ProductImageContainer.svg";
          const productId = fav.product; // backend favorite record includes product id
          const onRemove = async () => {
            const hasToken =
              typeof window !== "undefined" && !!localStorage.getItem("auth_access_token");
            if (!hasToken) return;
            try {
              await favoritesRemove(productId);
              setItems((prev) => prev.filter((f) => f.product !== productId));
              try {
                if (typeof window !== "undefined") {
                  const remaining = items.filter((f) => f.product !== productId).length;
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
          return (
            <FavoriteCard
              key={fav.id}
              card="favorite"
              dictionary={dictionary}
              title={title}
              price={price}
              imageSrc={imageSrc}
              onRemove={onRemove}
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
