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

function Card({
  product,
  dictionary,
  priority = false,
}: {
  product: ProductList;
  dictionary: any;
  priority?: boolean;
}) {
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
          <LampaImage product={product} priority={priority} />
          <ProductText product={product} />
          <div data-add-button onClick={handleInteractiveClick}>
            <AddButton product={product} dictionary={dictionary} />
          </div>
        </ClickableArea>
      </StyledRectangle>
    </StyledLink>
  );
}

export default Card;
