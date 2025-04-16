// import React from "react";
// import styled from "styled-components";
// import PrimaryButton from "../PrimaryButton/PrimaryButton";
// import CloseIcon from "../Header/CloseIcon";
// import ModalTitle from "./ModalTitle";
// import AuthToggleButtons from "./AuthToggleButtons";
// import ModalInput from "./ModalInput";
// import InputTitle from "./InputTitle";
// import ForgetPassword from "./ForgetPassword";

// const StyledContainer = styled.div`
//   padding-top: 82px;
// `;

// const StyledModal = styled.div`
//   position: relative;
//   background-color: #1c1c1c;
//   width: fit-content;
//   height: fit-content;
//   border-radius: 20px;
//   padding: 30px 24px 24px 24px;
// `;

// const StyledCloseIcon = styled.div`
//   position: absolute;
//   top: 24px;
//   right: 24px;
//   cursor: pointer;
// `;

// const StyledTitle = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const StyledAuthToggleButtons = styled.div`
//   margin-top: 30px;
// `;

// const StyledModalInput = styled.div`
//   margin-top: 20px;
// `;

// const StyledForgetPassword = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   margin-top: 10px;
// `;

// const StyledPrimaryButton = styled.div`
//   margin-top: 24px;
// `;

// type Props = {};

// const AuthorizationModal = (props: Props) => {
//   return (
//     <StyledContainer>
//       <StyledModal>
//         <StyledCloseIcon>
//           <CloseIcon />
//         </StyledCloseIcon>
//         <StyledTitle>
//           <ModalTitle text="ავტორიზაცია" />
//         </StyledTitle>
//         <StyledAuthToggleButtons>
//           <AuthToggleButtons />
//         </StyledAuthToggleButtons>
//         <StyledModalInput>
//           <InputTitle text="სახელი" />
//           <ModalInput />
//         </StyledModalInput>
//         <StyledModalInput>
//           <InputTitle text="ელ.ფოსტა" />
//           <ModalInput />
//         </StyledModalInput>
//         <StyledModalInput>
//           <InputTitle text="პაროლი" />
//           <ModalInput />
//         </StyledModalInput>
//         <StyledForgetPassword>
//           <ForgetPassword text="დაგავიწყდა პაროლი?" />
//         </StyledForgetPassword>
//         <StyledPrimaryButton>
//           <PrimaryButton text="შესვლა" width="460px" height="50px" />
//         </StyledPrimaryButton>
//       </StyledModal>
//     </StyledContainer>
//   );
// };

// export default AuthorizationModal;

import React, { useState } from "react";
import styled from "styled-components";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import CloseIcon from "../Header/CloseIcon";
import ModalTitle from "./ModalTitle";
import AuthToggleButtons from "./AuthToggleButtons";
import ModalInput from "./ModalInput";
import InputTitle from "./InputTitle";
import ForgetPassword from "./ForgetPassword";

const StyledContainer = styled.div`
  padding-top: 82px;
`;

const StyledModal = styled.div`
  position: relative;
  background-color: #1c1c1c;
  width: fit-content;
  height: fit-content;
  border-radius: 20px;
  padding: 30px 24px 24px 24px;
`;

const StyledCloseIcon = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
`;

const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledAuthToggleButtons = styled.div`
  margin-top: 30px;
`;

const StyledModalInput = styled.div`
  margin-top: 20px;
`;

const StyledForgetPassword = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const StyledPrimaryButton = styled.div`
  margin-top: 24px;
`;

const AuthorizationModal = () => {
  const [activeTab, setActiveTab] = useState<"auth" | "register">("auth");

  return (
    <StyledContainer>
      <StyledModal>
        <StyledCloseIcon>
          <CloseIcon />
        </StyledCloseIcon>

        <StyledTitle>
          <ModalTitle text={activeTab === "auth" ? "ავტორიზაცია" : "რეგისტრაცია"} />
        </StyledTitle>

        <StyledAuthToggleButtons>
          <AuthToggleButtons activeTab={activeTab} setActiveTab={setActiveTab} />
        </StyledAuthToggleButtons>

        {activeTab === "register" && (
          <StyledModalInput>
            <InputTitle text="სახელი" />
            <ModalInput />
          </StyledModalInput>
        )}

        <StyledModalInput>
          <InputTitle text="ელ.ფოსტა" />
          <ModalInput />
        </StyledModalInput>

        <StyledModalInput>
          <InputTitle text="პაროლი" />
          <ModalInput />
        </StyledModalInput>

        <StyledForgetPassword>
          <ForgetPassword text="დაგავიწყდა პაროლი?" />
        </StyledForgetPassword>

        <StyledPrimaryButton>
          <PrimaryButton text="შესვლა" width="460px" height="50px" />
        </StyledPrimaryButton>
      </StyledModal>
    </StyledContainer>
  );
};

export default AuthorizationModal;
