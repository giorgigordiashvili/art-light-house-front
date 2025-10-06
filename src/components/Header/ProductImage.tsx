import React from "react";
import Image from "next/image";

type Props = {
  imageSrc?: string;
};

const ProductImage = ({ imageSrc }: Props) => {
  const getImageSrc = () => {
    if (!imageSrc) return "/assets/emptyImage.svg";

    // Handle if primary_image is an object with 'image' property
    if (typeof imageSrc === "object" && imageSrc !== null) {
      return (imageSrc as any).image || "/assets/emptyImage.svg";
    }

    // Handle if primary_image is a string
    return imageSrc;
  };

  return <Image src={getImageSrc()} width={54} height={54} alt="product" />;
};

export default ProductImage;
