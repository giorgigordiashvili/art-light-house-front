"use client";
import { useRouter, usePathname } from "next/navigation";
import styled from "styled-components";

const StyleBuyButton = styled.div`
  width: 195px;
  height: 56px;
  background: #ffcb40;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media (max-width: 1180px) {
    width: 100%;
  }
  @media (max-width: 1080px) {
    max-width: 100%;
  }
`;

const ButtonText = styled.p`
  font-family: "Helvetica";
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
  color: #000000;
  margin: 0;
  transition: 0.2s ease-in-out;
  ${StyleBuyButton}:hover & {
    color: #ffffff;
  }
`;

type Props = {
  onClick?: () => void;
};

const BuyButton = ({ onClick, dictionary }: Props & { dictionary: any }) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const handleBuy = (e?: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else {
      if (e && (e.ctrlKey || e.metaKey)) {
        window.open(`/${locale}/checkout`, "_blank");
      } else {
        router.push(`/${locale}/checkout`);
      }
    }
  };

  const handleBuyMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      if (onClick) {
        onClick();
      } else {
        window.open(`/${locale}/checkout`, "_blank");
      }
    }
  };

  return (
    <StyleBuyButton onClick={handleBuy} onMouseDown={handleBuyMouseDown}>
      <ButtonText>{dictionary?.productDetails?.buy || "Buy"}</ButtonText>
    </StyleBuyButton>
  );
};

export default BuyButton;
