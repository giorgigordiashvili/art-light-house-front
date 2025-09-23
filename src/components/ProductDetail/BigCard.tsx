import styled from "styled-components";
import Image from "next/image";
import SmallCard from "./SmallCard";
import { ProductDetail } from "@/api/generated/interfaces";

const StyleBigCard = styled.div`
  /* max-width: 100%; */
  width: 636px;
  height: 636px;
  background: #1a1a1a96;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  z-index: 1;

  @media (max-width: 1080px) {
    max-width: 100%;
    width: 100%;
    height: 350px;
  }
`;

const MainImageWrapper = styled.div`
  width: 90%;
  height: 90%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 12px;
  }
`;

const InnerWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 16px;

  @media (max-width: 1080px) {
    gap: 8px;
    left: 13px;
    bottom: 14px;
  }
`;

const BigCard = ({ product }: { product: ProductDetail }) => {
  // Get the primary image or first image
  const primaryImage =
    (product.images as any)?.find((img: any) => img.is_primary) || (product.images as any)?.[0];
  // Check if we have a valid image URL
  const hasValidImage =
    primaryImage &&
    primaryImage.image &&
    typeof primaryImage.image === "string" &&
    primaryImage.image.trim() !== "";

  return (
    <StyleBigCard>
      {hasValidImage ? (
        <MainImageWrapper>
          <Image
            src={primaryImage.image}
            alt={primaryImage.alt_text || product.title}
            fill
            style={{ objectFit: "contain" }}
          />
        </MainImageWrapper>
      ) : (
        <MainImageWrapper>
          <div
            style={{
              color: "#ffffff40",
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            No image available
          </div>
        </MainImageWrapper>
      )}

      <InnerWrapper>
        {(product.images as any)
          ?.slice(0, 3)
          .map((image: any) => <SmallCard key={image.id} image={image} />)}
      </InnerWrapper>
    </StyleBigCard>
  );
};

export default BigCard;
