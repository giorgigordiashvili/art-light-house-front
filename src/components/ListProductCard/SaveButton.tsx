import Image from "next/image";
import styled from "styled-components";

const StyledSaveButton = styled.div`
  width: 268px;
  height: 55px;
  background: linear-gradient(
    92.9deg,
    rgba(247, 203, 87, 0.4) 3.7%,
    rgba(216, 177, 70, 0.4) 97.98%
  );
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  top: 342px;
  left: 20px;
  gap: 9px;

  @media (max-width: 1080px) {
    width: 154px;
    height: 48px;
    top: 838px;
    left: 28px;
  }
`;

const ButtonText = styled.span`
  font-family: Helvetica Neue LT GEO;
  font-weight: 700;
  font-size: 13px;
  line-height: 24px;
  letter-spacing: 0%;
  color: #f7cb57;

  @media (max-width: 1080px) {
    display: none;
  }
`;

type Props = {
  text?: string;
  onClick?: () => void;
};

const SaveButton = ({ text = "შენახვა", onClick }: Props) => {
  return (
    <StyledSaveButton onClick={onClick}>
      <Image src="/assets/bookmark-add.svg" alt="Add Icon" width={28} height={28} />
      <ButtonText>{text}</ButtonText>
    </StyledSaveButton>
  );
};

export default SaveButton;
