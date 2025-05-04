// import React from "react";
// import styled, { css } from "styled-components";

// type Props = {
//   text: string;
//   width?: string;
//   height?: string;
//   onClick?: () => void;
//   media?: "yes" | "no";
// };

// const StyledContainer = styled.div``;

// const StyledButton = styled.button<{ width?: string; height?: string; media?: "yes" | "no" }>`
//   height: ${(props) => props.height || "50px"};
//   width: ${(props) => props.width || "252px"};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: #ffcb40;
//   border: none;
//   border-radius: 10px;
//   font-family: HelRom;
//   font-weight: 700;
//   font-size: 16px;
//   line-height: 100%;
//   letter-spacing: 0%;
//   transition: color 0.2s ease;
//   cursor: pointer;
//   color: #000;

//   &:hover {
//     color: #fff;
//   }

//   ${(props) =>
//     props.media !== "no" &&
//     css`
//       @media (max-width: 1080px) {
//         width: 100%;
//       }
//     `}
// `;

// const PrimaryButton = ({ text, width, height, onClick, media }: Props) => {
//   return (
//     <StyledContainer>
//       <StyledButton width={width} height={height} onClick={onClick} media={media}>
//         {text}
//       </StyledButton>
//     </StyledContainer>
//   );
// };

// export default PrimaryButton;

import React from "react";
import styled, { css } from "styled-components";

type Props = {
  text: string;
  width?: string;
  height?: string;
  onClick?: () => void;
  media?: "yes" | "no" | "full";
};

const StyledContainer = styled.div<{ media?: "yes" | "no" | "full" }>`
  ${(props) =>
    props.media === "full" &&
    css`
      @media (max-width: 1080px) {
        width: 100%;
      }
    `}
`;

const StyledButton = styled.button<{
  width?: string;
  height?: string;
  media?: "yes" | "no" | "full";
}>`
  height: ${(props) => props.height || "50px"};
  width: ${(props) => props.width || "252px"};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffcb40;
  border: none;
  border-radius: 10px;
  font-family: HelRom;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  transition: color 0.2s ease;
  cursor: pointer;
  color: #000;

  &:hover {
    color: #fff;
  }

  ${(props) =>
    props.media !== "no" &&
    css`
      @media (max-width: 1080px) {
        width: 100%;
      }
    `}
`;

const PrimaryButton = ({ text, width, height, onClick, media }: Props) => {
  return (
    <StyledContainer media={media}>
      <StyledButton width={width} height={height} onClick={onClick} media={media}>
        {text}
      </StyledButton>
    </StyledContainer>
  );
};

export default PrimaryButton;
