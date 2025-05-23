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

const StyleCancelButton = styled.div`
  width: 143px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffcb401a;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  @media (max-width: 1080px) {
    max-width: 100%;
    width: 100%;
  }

  &:hover p {
    color: #fbe4a7;
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
};

const CancelButton = ({ onClick, dictionary }: Props) => {
  return (
    <StyleCancelButton onClick={onClick}>
      <ButtonText>{dictionary?.button1 || "Cancel"}</ButtonText>
    </StyleCancelButton>
  );
};

export default CancelButton;
