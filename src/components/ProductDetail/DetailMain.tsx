"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Container from "@/components/ui/Container";
import MenuBar from "./MenuBar";
import BigCard from "./BigCard";
import DetailDescription from "./DetailDescription";
import BuyButton from "./BuyButton";
import AddToCartButton from "./AddToCartButton";
import Image from "next/image";
import Card from "../ListProductCard/Card";
import LeftCircle from "../ui/LeftCircle";
import NewCircle from "../ui/NewCircle";
import Circle from "../ui/Circle";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useSimilarProducts } from "@/hooks/useSimilarProducts";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { cartAddItem } from "@/api/generated/api";

const StyledComponent = styled.div`
  background: black;
  margin-top: 80px;

  @media (max-width: 1080px) {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
`;

const StyledCircle = styled.div`
  position: absolute;
  bottom: -750px;
  left: 37%;
  transform: translateX(-50%);
  @media (max-width: 1080px) {
    display: none;
  }
`;

const FlexRow = styled.div`
  display: grid;
  grid-template-columns: 636px 563px;
  gap: 44px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;

  @media (max-width: 1080px) {
    align-items: center;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 21px;

  @media (max-width: 1080px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
`;

const ProductHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 100px;
  color: #ffffff;

  p {
    font-family: Helvetica;
    font-weight: 250;
    font-size: 34px;
    line-height: 24px;
    letter-spacing: 0%;
    @media (max-width: 1080px) {
      font-size: 24px;
    }
  }
`;
const CardGrid = styled.div`
  margin-top: 39px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-content: center;
  margin-bottom: 538px;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(auto-fill, minmax(170px, 2fr));
    gap: 10px;
    justify-items: center;
  }

  @media (max-width: 569px) {
    max-width: 350px;
    justify-content: center;
    justify-items: center;
    margin-left: auto;
    margin-right: auto;
  }
`;

function DetailMain({ dictionary, productId }: { dictionary: any; productId: number }) {
  const { product, loading, error } = useProductDetail(productId);
  const { openAuthModal } = useAuthModal();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Fetch similar products based on the current product's category
  const {
    similarProducts,
    loading: similarLoading,
    error: similarError,
  } = useSimilarProducts(product?.category, productId, 4);

  const handleAddToCart = async () => {
    if (!product) return;

    // Check if user is authenticated
    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("auth_access_token");
    if (!hasToken) {
      // User is not authenticated - open auth modal instead
      openAuthModal();
      return;
    }

    try {
      const payload = { product_id: product.id, quantity: 1 };
      const cart = await cartAddItem(payload);
      console.log("✅ Added to cart:", payload, "→ Cart:", cart);

      // Update cart count in header
      try {
        const count = Array.isArray(cart?.items)
          ? cart.items.reduce((acc: number, it: any) => acc + (it.quantity || 0), 0)
          : 0;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { count, cart } }));
        }
      } catch {}
    } catch (error) {
      console.error("❌ Failed to add to cart", error);
    }
  };

  // Set the selected image to primary image when product loads
  useEffect(() => {
    if (product && product.images) {
      const primaryImage =
        (product.images as any)?.find((img: any) => img.is_primary) || (product.images as any)?.[0];
      setSelectedImage(primaryImage);
    }
  }, [product]);

  if (loading) {
    return (
      <StyledComponent>
        <Container>
          <div
            style={{
              color: "#ffffff",
              textAlign: "center",
              padding: "40px",
              fontSize: "16px",
              minHeight: "50vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Loading product details...
          </div>
        </Container>
      </StyledComponent>
    );
  }

  if (error || !product) {
    return (
      <StyledComponent>
        <Container>
          <div
            style={{
              color: "#ff4444",
              textAlign: "center",
              padding: "40px",
              fontSize: "16px",
              minHeight: "50vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {error || "Product not found"}
          </div>
        </Container>
      </StyledComponent>
    );
  }

  return (
    <StyledComponent>
      <NewCircle size="small" right="142px" top="1000px" media="yes" />
      <LeftCircle size="small" left="-180px" top="900px" media="yes" />
      <StyledCircle>
        <Circle size="large" />
      </StyledCircle>
      <Container>
        <MenuBar dictionary={dictionary} />
        <FlexRow>
          <BigCard
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
          <RightColumn>
            <DetailDescription dictionary={dictionary} product={product} />
            <ButtonRow>
              <BuyButton dictionary={dictionary} />
              <AddToCartButton onClick={handleAddToCart} dictionary={dictionary} />
            </ButtonRow>
          </RightColumn>
        </FlexRow>

        <ProductHeader>
          <Image
            src="/assets/icons/notification-text.svg"
            alt={dictionary?.productDetails?.similarProducts || "Similar Products"}
            width={32}
            height={32}
            style={{ borderRadius: 8, objectFit: "cover" }}
          />
          <p>{dictionary?.productDetails?.similarProducts || "Similar Products"}</p>
        </ProductHeader>
        <CardGrid>
          {similarLoading ? (
            <div
              style={{
                gridColumn: "1 / -1",
                color: "#ffffff",
                textAlign: "center",
                padding: "40px",
                fontSize: "16px",
              }}
            >
              Loading similar products...
            </div>
          ) : similarError ? (
            <div
              style={{
                gridColumn: "1 / -1",
                color: "#ff4444",
                textAlign: "center",
                padding: "40px",
                fontSize: "16px",
              }}
            >
              Error loading similar products: {similarError}
            </div>
          ) : similarProducts.length > 0 ? (
            similarProducts.map((similarProduct) => (
              <Card
                key={similarProduct.id}
                product={similarProduct}
                dictionary={dictionary.productDetails}
              />
            ))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                color: "#ffffff60",
                textAlign: "center",
                padding: "40px",
                fontSize: "16px",
              }}
            >
              No similar products found
            </div>
          )}
        </CardGrid>
      </Container>
    </StyledComponent>
  );
}

export default DetailMain;
