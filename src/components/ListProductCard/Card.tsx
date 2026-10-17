import React from "react";
import styled from "styled-components";
import AddButton from "./AddButton";
import LampaImage from "./Image";
import ProductText from "./Text";
import ProductHeartIcon from "./ProductHeartIcon";
import { ProductList } from "@/api/generated/interfaces";
import Link from "next/link";

const StyledRectangle = styled.div`
  width: 308px;
  height: 417px;
  border-radius: 17px;
  border: 1px solid #ffffff12;
  background: #1a1a1a96;
  z-index: 2;
  backdrop-filter: blur(114px);
  cursor: pointer;
  transition: transform 0.3s ease;

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

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
`;

// "Out of stock" pill shown over the dimmed product image
const OutOfStockBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #ffffff1f;
  background: #0b0b0bcc;
  backdrop-filter: blur(8px);
  font-family: "Helvetica", sans-serif;
  font-size: 13px;
  line-height: 16px;
  font-weight: 400;
  color: #ffffffb3;
  white-space: nowrap;
  pointer-events: none;

  @media (max-width: 1080px) {
    top: 8px;
    left: 8px;
    padding: 4px 8px;
    font-size: 11px;
    line-height: 14px;
  }
`;

function Card({
  product,
  dictionary,
  priority = false,
}: {
  product: ProductList;
  dictionary: any;
  priority?: boolean;
}) {
  const isOutOfStock = product.is_in_stock === false;

  const handleInteractiveClick = (e: React.MouseEvent) => {
    // Stop propagation for interactive elements to prevent navigation
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <StyledLink href={`/products/${product.id}`} prefetch={true}>
      <StyledRectangle>
        <ClickableArea>
          <div data-heart-button onClick={handleInteractiveClick}>
            <ProductHeartIcon productId={product.id} />
          </div>
          {isOutOfStock && (
            <OutOfStockBadge>{dictionary?.outOfStock || "Out of stock"}</OutOfStockBadge>
          )}
          <LampaImage product={product} priority={priority} dimmed={isOutOfStock} />
          <ProductText product={product} />
          <div data-add-button onClick={handleInteractiveClick}>
            <AddButton product={product} dictionary={dictionary} disabled={isOutOfStock} />
          </div>
        </ClickableArea>
      </StyledRectangle>
    </StyledLink>
  );
}

export default Card;
