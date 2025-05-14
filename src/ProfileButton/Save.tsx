import styled from "styled-components";

const StyleSaveButton = styled.div`
  width: 143px;
  height: 48px;
  background: #ffcb40;
  border-radius: 10px;
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
    p {
      color: #fafafa;
    }
  }
`;

const ButtonText = styled.p`
  font-family: "Helvetica Neue LT GEO";
  font-weight: 700;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: 0%;
  color: #000000;
  transition: color 0.2s ease-in-out;
  margin: 0;
`;

type Props = {
  onClick?: () => void;
};

const SaveButton = ({ onClick }: Props) => {
  return (
    <StyleSaveButton onClick={onClick}>
      <ButtonText>შენახვა</ButtonText>
    </StyleSaveButton>
  );
};

export default SaveButton;
