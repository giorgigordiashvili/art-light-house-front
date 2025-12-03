import styled from "styled-components";
import Image from "next/image";
import SmallCard from "./SmallCard";
import { ProductDetail } from "@/api/generated/interfaces";
import ReturnIcon from "../Header/ReturnIcon";
import RightSlide from "../MainPage/NewProducts/RightSlide";
import { useRef, useState, useEffect } from "react";

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
  scroll-behavior: smooth;
  transition: scroll-behavior 0.3s ease;

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
  padding-inline: 20px;
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  // Use selectedImage if available, otherwise fallback to primary image
  const displayImage =
    selectedImage ||
    (product.images as any)?.find((img: any) => img.is_primary) ||
    (product.images as any)?.[0] ||
    (product.image
      ? { id: "primary-fallback", image: product.image, alt_text: product.name }
      : null);

  // Check if we have a valid image URL
  const hasValidImage =
    displayImage &&
    (displayImage.image || displayImage.image_url) &&
    typeof (displayImage.image || displayImage.image_url) === "string" &&
    (displayImage.image || displayImage.image_url).trim() !== "";

  // Get current image index and total images
  const images = (product.images as any) || [];

  // Sort images to put primary image first
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return 0;
  });

  const currentImageIndex = displayImage
    ? sortedImages.findIndex((img: any) => img.id === displayImage.id)
    : 0;

  const scrollThumbnailsToIndex = (index: number) => {
    if (thumbnailScrollRef.current && sortedImages.length > 0) {
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
    if (sortedImages.length > 0) {
      const previousIndex = currentImageIndex > 0 ? currentImageIndex - 1 : sortedImages.length - 1;
      setSelectedImage(sortedImages[previousIndex]);
      scrollThumbnailsToIndex(previousIndex);
    }
  };

  const scrollToNextImage = () => {
    if (sortedImages.length > 0) {
      const nextIndex = currentImageIndex < sortedImages.length - 1 ? currentImageIndex + 1 : 0;
      setSelectedImage(sortedImages[nextIndex]);
      scrollThumbnailsToIndex(nextIndex);
    }
  };

  // Drag scrolling handlers for thumbnails
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!thumbnailScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - thumbnailScrollRef.current.offsetLeft);
    setScrollLeft(thumbnailScrollRef.current.scrollLeft);
    setDragDistance(0);
    thumbnailScrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (thumbnailScrollRef.current) {
      thumbnailScrollRef.current.style.cursor = "grab";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (thumbnailScrollRef.current) {
      thumbnailScrollRef.current.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !thumbnailScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - thumbnailScrollRef.current.offsetLeft;
    const walk = (x - startX) * 0.1; // Reduced multiplier for slower, smoother scrolling
    setDragDistance(Math.abs(walk));
    thumbnailScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleThumbnailClick = (image: any) => {
    // Only trigger click if we haven't dragged much (less than 5px)
    if (dragDistance < 5) {
      setSelectedImage(image);
    }
  };

  // Add effect to handle global mouse events
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      if (thumbnailScrollRef.current) {
        thumbnailScrollRef.current.style.cursor = "grab";
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !thumbnailScrollRef.current) return;
      e.preventDefault();
      const x = e.pageX - thumbnailScrollRef.current.offsetLeft;
      const walk = (x - startX) * 1.2; // Reduced multiplier for slower, smoother scrolling
      setDragDistance(Math.abs(walk));
      thumbnailScrollRef.current.scrollLeft = scrollLeft - walk;
    };

    if (isDragging) {
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.addEventListener("mousemove", handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [isDragging, startX, scrollLeft]);

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
            src={displayImage.image || displayImage.image_url}
            alt={
              displayImage.alt_text || (typeof product.name === "string" ? product.name : "Product")
            }
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

      <InnerWrapper
        ref={thumbnailScrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: "grab", userSelect: "none" }}
      >
        {sortedImages.map((image: any) => (
          <SmallCard
            key={image.id}
            image={image}
            onClick={() => handleThumbnailClick(image)}
            isSelected={displayImage?.id === image.id}
          />
        ))}
      </InnerWrapper>
    </StyleBigCard>
  );
};

export default BigCard;
