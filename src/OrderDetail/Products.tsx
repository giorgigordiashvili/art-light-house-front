import styled from "styled-components";

const ProductsCard = styled.div`
  display: flex;
  align-items: center;
  background: #2a2a2a96;
  padding: 20px;
  border-radius: 17px;
  color: white;
  width: 100%;
  max-width: 532px;
  /* min-width:340px; */
  height: 113px;
  position: relative;
  gap: 24px;
`;

const ImagePlaceholder = styled.div`
  width: 73px;
  height: 73px;
  background-color: #3a3a3a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #ccc;
  flex-shrink: 0;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
`;

const Title = styled.span`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 17px;
`;

const Price = styled.span`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
`;

interface ProductProps {
  dictionary: any;
}

const Product = ({ dictionary }: ProductProps) => {
  return (
    <ProductsCard>
      <ImagePlaceholder>Product image</ImagePlaceholder>
      <InfoWrapper>
        <Title>{dictionary?.succsessOrder?.productTitle || "Product Title"}</Title>
        <Price>{dictionary?.succsessOrder?.productPrice || "199.99 ₾"}</Price>
      </InfoWrapper>
    </ProductsCard>
  );
};

export default Product;
