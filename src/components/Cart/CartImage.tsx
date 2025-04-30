import React from "react";
import Image from "next/image";

const CartImage = () => {
  return <Image src={"/assets/CartIcon.svg"} width={70} height={70} alt="shopping-cart" />;
};

export default CartImage;
