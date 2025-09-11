"use client";
import React from "react";
import styled from "styled-components";
import AddButton from "./AddButton";
import ProductText from "./Text";
import Image from "next/image";
import { Product } from "@/lib/productService";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
const StyledRectangle = styled.div`
  width: 308px;
  height: 417px;
  border-radius: 17px;
  border: 1px solid #ffffff12;
  background: #1a1a1a96;
  z-index: 2;
  backdrop-filter: blur(114px);
  cursor: pointer;
  &:hover {
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      padding: 1px; /* სიგანე ბორდერის */
      border-radius: 17px;
      background: linear-gradient(180deg, #f2c754 0%, rgba(242, 199, 84, 0) 100%);
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
      z-index: 1;
      pointer-events: none;
    }
  }
  @media (max-width: 1080px) {
    width: 170px;
    height: 275px;
    top: 335px;
    left: 20px;
    &:hover {
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        padding: 1px; /* სიგანე ბორდერის */
        border-radius: 17px;
        background: linear-gradient(180deg, #f2c754 0%, rgba(242, 199, 84, 0) 100%);
        mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
        mask-composite: exclude;
        z-index: 1;
        pointer-events: none;
      }
    }
  }
`;

interface CardProps {
  dictionary: any;
  product?: Product; // optional to allow placeholder usage without data
}

function Card({ dictionary, product }: CardProps) {
  const router = useRouter();
  const params = useParams();
  const langParam = (params as any)?.lang;
  const locale = ["ge", "en"].includes(langParam) ? langParam : "ge";

  // Safely access first image only if product exists
  const firstImage = product?.images?.[0];

  const handleNavigate = () => {
    if (!product?.id) return; // ignore placeholder cards
    router.push(`/${locale}/products/${product.id}`);
  };

  const addToCartHandler = async () => {
    await axios.post(
      "https://api.artlighthouse.ge/en/add-to-cart",
      { productId: 5 },
      { withCredentials: true }
    );
  };

  return (
    <StyledRectangle onClick={handleNavigate} role={product?.id ? "button" : undefined}>
      {firstImage && (
        <div style={{ position: "absolute", top: 30, left: 0, width: 308, height: 218 }}>
          <Image
            src={firstImage.url}
            alt={firstImage.alt || product?.title || "Product image"}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width:1080px) 170px, 308px"
            priority
          />
        </div>
      )}
      {product && <ProductText product={product} />}
      <AddButton
        dictionary={dictionary}
        onClick={() => {
          addToCartHandler();
          /* future add-to-cart: stopPropagation not needed because wrapper not inside clickable? Card handles click so we keep button clickable without navigation by stopping at AddButton level via pointer events if required */
        }}
      />
    </StyledRectangle>
  );
}

export default Card;
