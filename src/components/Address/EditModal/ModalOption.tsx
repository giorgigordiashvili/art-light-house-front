// import React from "react";
// import styled from "styled-components";

// type ColorOption = "red" | "white";

// type Props = {
//   text: string;
//   color?: ColorOption;
// };

// const StyledText = styled.div<{ colorOption?: ColorOption }>`
//   font-family: Helvetica;
//   font-weight: 500;
//   font-size: 12px;
//   line-height: 159%;
//   letter-spacing: 0px;
//   vertical-align: middle;
//   text-align: center;
//   color: ${({ colorOption }) => (colorOption === "red" ? "#FF2626" : "#FFFFFF")};
//   padding: 13px 36px 10px 40px;
// `;

// const ModalOption = ({ text, color = "white" }: Props) => {
//   return <StyledText colorOption={color}>{text}</StyledText>;
// };

// export default ModalOption;

import React from "react";
import styled from "styled-components";

type ColorOption = "red" | "white";

type Props = {
  text: string;
  color?: ColorOption;
};

const StyledText = styled(({ colorOption, ...rest }) => <div {...rest} />)<{
  colorOption?: ColorOption;
}>`
  font-family: Helvetica;
  font-weight: 500;
  font-size: 12px;
  line-height: 159%;
  letter-spacing: 0px;
  vertical-align: middle;
  text-align: center;
  color: ${({ colorOption }) => (colorOption === "red" ? "#FF2626" : "#FFFFFF")};
  padding: 13px 36px 10px 40px;
`;

const ModalOption = ({ text, color = "white" }: Props) => {
  return <StyledText colorOption={color}>{text}</StyledText>;
};

export default ModalOption;
