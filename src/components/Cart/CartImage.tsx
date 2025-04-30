import React from "react";
import Image from "next/image";

interface CartImageProps {
  image: "cart" | "favorite";
}

const CartImage: React.FC<CartImageProps> = ({ image }) => {
  const imageSrc = image === "cart" ? "/assets/CartIcon.svg" : "/assets/FavoriteIcon.svg";

  return (
    <Image
      src={imageSrc}
      width={70}
      height={70}
      alt={image === "cart" ? "shopping-cart" : "favorite-icon"}
    />
  );
};

export default CartImage;
