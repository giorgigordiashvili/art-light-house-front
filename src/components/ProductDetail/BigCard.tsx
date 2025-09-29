import styled from "styled-components";
import Image from "next/image";
import SmallCard from "./SmallCard";
import { ProductDetail } from "@/api/generated/interfaces";
import ReturnIcon from "../Header/ReturnIcon";
import RightSlide from "../MainPage/NewProducts/RightSlide";
import { useRef } from "react";

const StyleBigCard = styled.div`
  /* max-width: 100%; */
  width: 636px;
  height: 636px;
  overflow: hidden;
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
  max-width: calc(100% - 40px);
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1080px) {
    gap: 8px;
    left: 13px;
    bottom: 14px;
    max-width: calc(100% - 26px);
  }
`;

const StyledActions = styled.div`
  position: absolute;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const BigCard = ({
  product,
  selectedImage,
  setSelectedImage,
}: {
  product: ProductDetail;
  selectedImage: any;
  setSelectedImage: (image: any) => void;
}) => {
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  // Use selectedImage if available, otherwise fallback to primary image
  const displayImage =
    selectedImage ||
    (product.images as any)?.find((img: any) => img.is_primary) ||
    (product.images as any)?.[0];

  // Check if we have a valid image URL
  const hasValidImage =
    displayImage &&
    displayImage.image &&
    typeof displayImage.image === "string" &&
    displayImage.image.trim() !== "";

  // Get current image index and total images
  const images = (product.images as any) || [];
  const currentImageIndex = displayImage
    ? images.findIndex((img: any) => img.id === displayImage.id)
    : 0;

  const scrollThumbnailsToIndex = (index: number) => {
    if (thumbnailScrollRef.current && images.length > 0) {
      const container = thumbnailScrollRef.current;
      const containerWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;
      const scrollRight = scrollLeft + containerWidth;

      // Get the actual thumbnail width + gap from CSS
      // SmallCard: 120px width + 16px gap (desktop), 64px width + 8px gap (mobile)
      const isMobile = window.innerWidth <= 1080;
      const thumbnailWidth = isMobile ? 64 + 8 : 120 + 16; // width + gap
      const targetPosition = index * thumbnailWidth;

      // Check if the target thumbnail is outside the visible area
      if (targetPosition < scrollLeft || targetPosition > scrollRight - thumbnailWidth) {
        container.scrollTo({
          left: Math.max(0, targetPosition - containerWidth / 2),
          behavior: "smooth",
        });
      }
    }
  };

  const scrollToPreviousImage = () => {
    if (images.length > 0) {
      const previousIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
      setSelectedImage(images[previousIndex]);
      scrollThumbnailsToIndex(previousIndex);
    }
  };

  const scrollToNextImage = () => {
    if (images.length > 0) {
      const nextIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
      setSelectedImage(images[nextIndex]);
      scrollThumbnailsToIndex(nextIndex);
    }
  };

  return (
    <StyleBigCard>
      <StyledActions>
        <div onClick={scrollToPreviousImage}>
          <ReturnIcon />
        </div>
        <div onClick={scrollToNextImage}>
          <RightSlide />
        </div>
      </StyledActions>

      {hasValidImage ? (
        <MainImageWrapper>
          <Image
            src={displayImage.image}
            alt={displayImage.alt_text || product.title}
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

      <InnerWrapper ref={thumbnailScrollRef}>
        {(product.images as any)
          ?.slice(0, 10)
          .map((image: any) => (
            <SmallCard
              key={image.id}
              image={image}
              onClick={() => setSelectedImage(image)}
              isSelected={displayImage?.id === image.id}
            />
          ))}
      </InnerWrapper>
    </StyleBigCard>
  );
};

export default BigCard;
