import React from "react";
import styled from "styled-components";
import AddButton from "./AddButton";
import LampaImage from "./Image";
import ProductText from "./Text";
import ProductHeartIcon from "./ProductHeartIcon";
import { ProductList } from "@/api/generated/interfaces";
import { useRouter } from "next/navigation";

const StyledRectangle = styled.div`
  width: 308px;
  height: 417px;
  border-radius: 17px;
  border: 1px solid #ffffff12;
  background: #1a1a1a96;
  z-index: 2;
  backdrop-filter: blur(114px);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      padding: 1px; /* სიგანე ბორდერის */
      border-radius: 17px;
      background: linear-gradient(180deg, #f2c754 0%, rgba(242, 199, 84, 0) 100%);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask:
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
      transform: translateY(-3px);
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        padding: 1px; /* სიგანე ბორდერის */
        border-radius: 17px;
        background: linear-gradient(180deg, #f2c754 0%, rgba(242, 199, 84, 0) 100%);
        -webkit-mask:
          linear-gradient(#fff 0 0) content-box,
          linear-gradient(#fff 0 0);
        mask:
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

const ClickableArea = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

function Card({ product, dictionary }: { product: ProductList; dictionary: any }) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if the click is on the add button or heart icon
    const target = e.target as HTMLElement;
    if (target.closest("[data-add-button]") || target.closest("[data-heart-button]")) {
      return;
    }

    // Check for Ctrl+click (Windows/Linux) or Cmd+click (Mac) or middle-click
    if (e.ctrlKey || e.metaKey || e.button === 1) {
      window.open(`/products/${product.id}`, "_blank");
      return;
    }

    // Navigate to product detail page
    router.push(`/products/${product.id}`);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Handle middle-click (mouse wheel click)
    if (e.button === 1) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-add-button]") && !target.closest("[data-heart-button]")) {
        e.preventDefault(); // Prevent default middle-click behavior
        window.open(`/products/${product.id}`, "_blank");
      }
    }
  };

  return (
    <StyledRectangle onClick={handleCardClick} onMouseDown={handleMouseDown}>
      <ClickableArea>
        <ProductHeartIcon productId={product.id} defaultIsFavorite={product.is_favorite} />
        <LampaImage product={product} />
        <ProductText product={product} />
        <AddButton product={product} dictionary={dictionary} />
      </ClickableArea>
    </StyledRectangle>
  );
}

export default Card;
