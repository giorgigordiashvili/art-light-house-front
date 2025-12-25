import styled from "styled-components";
import { ProductDetail } from "@/api/generated/interfaces";
import Quantity from "./Quantity";

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

function pickLocalized(value: any, fallback = ""): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    let lang = "ka";
    if (typeof window !== "undefined") {
      const seg = (window.location.pathname.split("/")[1] || "").toLowerCase();
      lang = seg === "en" ? "en" : "ka"; // 'ge' route maps to 'ka'
    }
    return value[lang] || value.en || value.ka || fallback;
  }
  return fallback;
}

const DetailDescription = ({
  dictionary,
  product,
}: {
  dictionary: any;
  product: ProductDetail;
}) => {
  const shortDesc = pickLocalized(product.short_description);
  const fullDesc = pickLocalized(product.description);
  const quantityLabel = dictionary?.productDetails?.quantity || "Quantity";
  return (
    <Wrapper>
      <Title>{pickLocalized((product as any).title ?? product.name)}</Title>
      <Price>{product.price} ₾</Price>
      {shortDesc && (
        <Description style={{ fontWeight: 500, marginBottom: "16px" }}>{shortDesc}</Description>
      )}
      <Description>{fullDesc}</Description>
      <Quantity text={`${quantityLabel}: ${product.quantity}`} />
    </Wrapper>
  );
};

export default DetailDescription;
