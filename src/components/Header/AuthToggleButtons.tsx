// import React, { useState } from "react";
// import styled from "styled-components";

// const StyledContainer = styled.div`
//   display: flex;
//   gap: 12px;
//   background-color: #131313;
//   padding: 5px;
//   border-radius: 12px;
//   width: fit-content;
// `;

// type ButtonProps = {
//   active: boolean;
// };

// const ToggleButton = styled.button<ButtonProps>`
//   width: 219px;
//   height: 47px;
//   padding: 10px 24px;
//   border: none;
//   border-radius: 10px;
//   background-color: ${(props) => (props.active ? "#ffcb40" : "transparent")};
//   color: ${(props) => (props.active ? "#000000" : "#ffffff")};
//   font-family: HelRom;
//   font-weight: 700;
//   font-size: 14px;
//   line-height: 100%;
//   letter-spacing: 0%;
//   cursor: pointer;
//   transition: background-color 0.2s ease;

//   &:hover {
//     background-color: ${(props) => (props.active ? "#ffcb40" : "#2a2a2a")};
//   }
// `;

// const AuthToggleButtons = () => {
//   const [activeTab, setActiveTab] = useState<"auth" | "register">("auth");

//   return (
//     <StyledContainer>
//       <ToggleButton active={activeTab === "auth"} onClick={() => setActiveTab("auth")}>
//         ავტორიზაცია
//       </ToggleButton>
//       <ToggleButton active={activeTab === "register"} onClick={() => setActiveTab("register")}>
//         რეგისტრაცია
//       </ToggleButton>
//     </StyledContainer>
//   );
// };

// export default AuthToggleButtons;

import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  display: flex;
  gap: 12px;
  background-color: #131313;
  padding: 5px;
  border-radius: 12px;
  width: fit-content;
`;

type ButtonProps = {
  active: boolean;
};

const ToggleButton = styled.button<ButtonProps>`
  width: 219px;
  height: 47px;
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  background-color: ${(props) => (props.active ? "#ffcb40" : "transparent")};
  color: ${(props) => (props.active ? "#000000" : "#ffffff")};
  font-family: HelRom;
  font-weight: 700;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#ffcb40" : "#2a2a2a")};
  }
`;

type Props = {
  activeTab: "auth" | "register";
  setActiveTab: (tab: "auth" | "register") => void;
};

const AuthToggleButtons = ({ activeTab, setActiveTab }: Props) => {
  return (
    <StyledContainer>
      <ToggleButton active={activeTab === "auth"} onClick={() => setActiveTab("auth")}>
        ავტორიზაცია
      </ToggleButton>
      <ToggleButton active={activeTab === "register"} onClick={() => setActiveTab("register")}>
        რეგისტრაცია
      </ToggleButton>
    </StyledContainer>
  );
};

export default AuthToggleButtons;
