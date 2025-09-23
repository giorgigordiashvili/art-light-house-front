import styled from "styled-components";
import { ProductDetail } from "@/api/generated/interfaces";

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

const DetailDescription = ({ product }: { dictionary: any; product: ProductDetail }) => {
  return (
    <Wrapper>
      <Title>{product.title}</Title>
      <Price>{product.price} ₾</Price>
      <Description>{product.description}</Description>
    </Wrapper>
  );
};

export default DetailDescription;
