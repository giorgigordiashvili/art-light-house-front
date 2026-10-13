import styled from "styled-components";
import Image from "next/image";

const StyleAddButton = styled.div<{ $disabled?: boolean }>`
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
  @media (max-width: 1180px) {
    width: 100%;
  }
  @media (max-width: 1080px) {
    max-width: 100%;
  }
  &:hover {
    background: #624e16;
  }

  ${({ $disabled }) =>
    $disabled &&
    `
    opacity: 0.45;
    cursor: not-allowed;
    &:hover {
      background: linear-gradient(180deg, #0b0b0b 0%, #0b0b0b 44.74%, #0b0b0b 55.23%, #0b0b0b 63.52%);
    }
  `}
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
  /** Product is out of stock - button is shown but inactive */
  disabled?: boolean;
};

const AddToCartButton = ({
  onClick,
  disabled = false,
  dictionary,
}: Props & { dictionary: any }) => {
  const label = disabled
    ? dictionary?.productDetails?.outOfStock || "Out of stock"
    : dictionary?.productDetails?.addToCart || "Add to cart";

  return (
    <StyleAddButton onClick={disabled ? undefined : onClick} $disabled={disabled}>
      <Image src="/assets/icons/addToCart.svg" alt="cart" width={24} height={24} />
      <ButtonText>{label}</ButtonText>
    </StyleAddButton>
  );
};

export default AddToCartButton;
