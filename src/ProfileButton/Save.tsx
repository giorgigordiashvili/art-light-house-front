import styled from "styled-components";

const StyleSaveButton = styled.div<{ disabled?: boolean }>`
  width: 143px;
  height: 48px;
  background: ${({ disabled }) => (disabled ? "#999999" : "#ffcb40")};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: 0.2s ease-in-out;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};

  @media (max-width: 1080px) {
    max-width: 100%;
    width: 100%;
  }

  &:hover {
    p {
      color: ${({ disabled }) => (disabled ? "#000000" : "#fafafa")};
    }
  }
`;

const ButtonText = styled.p`
  font-family: "Helvetica";
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
  dictionary?: any;
  onSave?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

const SaveButton = ({
  onClick,
  dictionary,
  onSave,
  disabled = false,
  isLoading = false,
}: Props) => {
  const handleClick = () => {
    if (disabled || isLoading) return;

    if (onSave) {
      onSave();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <StyleSaveButton onClick={handleClick} disabled={disabled || isLoading}>
      <ButtonText>{isLoading ? "Saving..." : dictionary?.button2 || "Save"}</ButtonText>
    </StyleSaveButton>
  );
};

export default SaveButton;
