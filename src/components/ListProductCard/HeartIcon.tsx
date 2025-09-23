"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { favoritesAdd } from "@/api/generated/api";
import type { AddToFavoritesRequest } from "@/api/generated/interfaces";

type Props = {
  productId: number;
  defaultIsFavorite?: boolean | string;
};

const HeartIcon = ({ productId, defaultIsFavorite }: Props) => {
  const initial = useMemo(() => {
    if (typeof defaultIsFavorite === "string") {
      const v = defaultIsFavorite.trim().toLowerCase();
      return v === "true" || v === "1" || v === "yes";
    }
    return Boolean(defaultIsFavorite);
  }, [defaultIsFavorite]);

  const [isFavorite, setIsFavorite] = useState<boolean>(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubmitting || isFavorite) return;

    try {
      setIsSubmitting(true);
      const payload: AddToFavoritesRequest = { product_id: productId };
      await favoritesAdd(payload);
      setIsFavorite(true);
    } catch (err) {
      console.error("Failed to add to favorites", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const src = isFavorite ? "/assets/icons/filled-heart.png" : "/assets/icons/heart.png";
  const alt = isFavorite ? "favorite" : "add to favorites";

  return (
    <span onClick={handleClick} data-heart-button="true" style={{ display: "inline-flex" }}>
      <Image src={src} alt={alt} width={44} height={44} />
    </span>
  );
};

export default HeartIcon;
