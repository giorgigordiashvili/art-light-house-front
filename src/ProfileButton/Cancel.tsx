// import styled from "styled-components";

// const StyleCancelButton = styled.div`
//   /* position: absolute; */
//   width: 143px;
//   height: 48px;
//   border-radius: 10px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border: 1px solid #ffcb401a;
//   cursor: pointer;
//   @media (max-width: 1080px) {
//     max-width: 100%;
//     width: 100%;
//   }
// `;
// const ButtonText = styled.p`
//   font-family: "Helvetica Neue LT GEO";
//   font-weight: 700;
//   font-size: 14px;
//   line-height: 28px;
//   letter-spacing: 0%;
//   color: #ffcb40;
//   margin: 0;
// `;
// type Props = {
//   onClick?: () => void;
// };

// const CancelButton = ({ onClick }: Props) => {
//   return (
//     <StyleCancelButton onClick={onClick}>
//       <ButtonText>გაუქმება</ButtonText>
//     </StyleCancelButton>
//   );
// };

// export default CancelButton;

import styled from "styled-components";

const StyleCancelButton = styled.div<{ disabled?: boolean }>`
  width: 143px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffcb401a;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease-in-out;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  @media (max-width: 1080px) {
    max-width: 100%;
    width: 100%;
  }

  &:hover p {
    color: ${({ disabled }) => (disabled ? "#ffcb40" : "#fbe4a7")};
  }
`;

const ButtonText = styled.p`
  font-family: "Helvetica";
  font-weight: 700;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: 0%;
  color: #ffcb40;
  margin: 0;
  transition: color 0.2s ease-in-out;
`;

type Props = {
  onClick?: () => void;
  dictionary?: any;
  onCancel?: () => void;
  disabled?: boolean;
};

const CancelButton = ({ onClick, dictionary, onCancel, disabled = false }: Props) => {
  const handleClick = () => {
    if (disabled) return;

    if (onCancel) {
      onCancel();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <StyleCancelButton onClick={handleClick} disabled={disabled}>
      <ButtonText>{dictionary?.button1 || "Cancel"}</ButtonText>
    </StyleCancelButton>
  );
};

export default CancelButton;
