import styled from "styled-components";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const StyleAddButton = styled.div`
  /* position: absolute; */
  width: 232px;
  height: 56px;
  background: linear-gradient(180deg, #0b0b0b 0%, #0b0b0b 44.74%, #0b0b0b 55.23%, #0b0b0b 63.52%);
  border-radius: 12px;
  border-width: 1px;
  backdrop-filter: blur(114px);
  border: 1px solid #ffffff1f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  @media (max-width: 1080px) {
    max-width: 100%;
    width: 100%;
  }
  &:hover {
    background: #624e16;
  }
`;
const ButtonText = styled.p`
  font-family: "Helvetica";
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
  color: #ffffff;
  margin-left: 17px;
`;
type Props = {
  onClick?: () => void;
};

const AddToCartButton = ({ onClick }: Props) => {
  const { dictionary } = useLanguage();
  return (
    <StyleAddButton onClick={onClick}>
      <Image src="/assets/icons/addToCart.svg" alt="cart" width={24} height={24} />
      <ButtonText>{dictionary.productDetails.addToCart}</ButtonText>
    </StyleAddButton>
  );
};

export default AddToCartButton;
