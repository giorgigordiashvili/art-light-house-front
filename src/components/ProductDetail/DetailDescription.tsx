import styled from "styled-components";

const Wrapper = styled.div`
  color: white;
  font-family: "Helvetica", sans-serif;
  max-width: 563px;
  @media (max-width: 1080px) {
    max-width: 100%;
    width: 100%;
  }
`;

const Title = styled.p`
  margin-bottom: 45px;
  font-weight: 300;
  font-size: 34px;
  line-height: 24px;
  letter-spacing: 0%;
  vertical-align: middle;
  @media (max-width: 1080px) {
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 18px;
  }
`;

const Price = styled.p`
  margin-bottom: 34px;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  letter-spacing: 0%;
  vertical-align: middle;
  @media (max-width: 1080px) {
    font-size: 28px;
    line-height: 48px;
    margin-bottom: 24px;
  }
`;

const Description = styled.p`
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0%;
  @media (max-width: 1080px) {
    font-size: 13px;
    line-height: 24px;
  }
`;

import { Product } from "@/lib/productService";

interface DetailDescriptionProps {
  dictionary: any;
  product: Product | null;
}

const DetailDescription = ({ dictionary, product }: DetailDescriptionProps) => {
  const title = product?.title || dictionary?.productDetails?.title || "Blue Star Chandelier";
  const price = product?.price
    ? `${product.price} ₾`
    : dictionary?.productDetails?.price || "199,99 ₾";
  const description =
    product?.description ||
    dictionary?.productDetails?.description ||
    "This chandelier is designed with a modern aesthetic and perfectly suits any interior style. Its unique shape and blue elements create a special atmosphere in your home. The chandelier is equipped with energy-efficient LED bulbs, ensuring long service life and low energy consumption. Buy now on our website and enrich your space!";
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Price>{price}</Price>
      <Description>{description}</Description>
    </Wrapper>
  );
};

export default DetailDescription;
