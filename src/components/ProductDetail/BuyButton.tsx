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
  @media (max-width: 1080px) {
    max-width: 100%;
    width: 100%;
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

const BuyButton = ({ onClick }: Props) => {
  return (
    <StyleBuyButton onClick={onClick}>
      <ButtonText>ყიდვა</ButtonText>
    </StyleBuyButton>
  );
};

export default BuyButton;
