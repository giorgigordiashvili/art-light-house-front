// import React from "react";
// import styled from "styled-components";
// import ModalOption from "./ModalOption";
// import DividerLine from "@/components/MainPage/HeroAndCategory/DividerLine";

// const StyledContainer = styled.div`
//     width: 160px;
//     height: 83px;
//     border-radius: 10px;
//     background-color: #2A2A2A96;
//     border: 1px solid #FFFFFF12;
//     backdrop-filter: blur(114px);
// `

// type Props = {};

// const EditModal = (props: Props) => {
//   return (
//     <StyledContainer>
//         <ModalOption text="რედაქტირება" color="white"/>
//         <DividerLine/>
//         <ModalOption text="წაშლა" color="red"/>
//     </StyledContainer>
//   )
// };

// export default EditModal;

import React from "react";
import styled from "styled-components";
import ModalOption from "./ModalOption";
import DividerLine from "@/components/MainPage/HeroAndCategory/DividerLine";

const StyledContainer = styled.div`
  position: absolute;
  top: 67px;
  right: 22px;
  width: 160px;
  height: 83px;
  border-radius: 10px;
  background-color: #242323;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  margin-top: 8px;
  z-index: 999;
`;

type Props = {
  onClose: () => void;
};

const EditModal = ({ onClose }: Props) => {
  return (
    <StyledContainer>
      <ModalOption text="რედაქტირება" color="white" />
      <DividerLine />
      <ModalOption text="წაშლა" color="red" />
    </StyledContainer>
  );
};

export default EditModal;
