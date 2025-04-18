// import React from "react";
// import styled from "styled-components";

// const StyledContainer = styled.div`
//   margin-top: 12px;
// `;

// type Props = {
//   placeholder?: string;
// };

// const ModalInput = ({ placeholder }: Props) => {
//   return (
//     <StyledContainer>
//       <input
//         type="text"
//         placeholder={placeholder}
//         style={{
//           width: "460px",
//           height: "50px",
//           border: "1px solid #FFFFFF12",
//           borderRadius: "10px",
//           padding: "0 16px",
//           fontSize: "16px",
//           backgroundColor: "#2A2A2A96",
//           color: "#fafafa",
//           outline: "none",
//           cursor: "pointer",
//         }}
//       />
//     </StyledContainer>
//   );
// };

// export default ModalInput;


import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  margin-top: 12px;

  input {
    width: 460px;
    height: 50px;
    border: 1px solid #ffffff12;
    border-radius: 10px;
    padding: 0 16px;
    font-size: 16px;
    background-color: #2a2a2a96;
    color: #fafafa;
    outline: none;
    cursor: pointer;

    @media (max-width: 1080px) {
      width: 100%;
    }
  }
`;

type Props = {
  placeholder?: string;
};

const ModalInput = ({ placeholder }: Props) => {
  return (
    <StyledContainer>
      <input type="text" placeholder={placeholder} />
    </StyledContainer>
  );
};

export default ModalInput;

