// import React from "react";
// import styled from "styled-components";
// import Image from "next/image";
// import CartTitle from "./CartTitle";
// import CartDescription from "./CartDescription";

// const StyledContainer = styled.div`
//   position: absolute;
//   width: 349px;
//   height: 312px;
//   border: 1px solid #ffffff12;
//   backdrop-filter: blur(114px);
//   background-color: #1a1a1a96;
//   display: flex;
//   align-items: center;
//   flex-direction: column;
//   top: 74px;
//   right: 20px; /* <<<<< changed */
//   padding: 0;
//   z-index: 1001;
//   border-radius: 17px;

//   @media (min-width: 1200px) {
//     right: 311px;
//   }
// `;

// const StyledImage = styled.div`
//   margin-top: 48px;
// `;

// const EmptyCartModal = () => {
//   return (
//     <StyledContainer>
//       <StyledImage>
//         <Image src={"/assets/EmptyCartImage.svg"} width={123} height={123} alt="cart-icon" />
//       </StyledImage>
//       <CartTitle text="კალათა ცარიელია" />
//       <CartDescription text="დაამატე პროდუქტები ქალათში და გააფორმე შეკვეთა" />
//     </StyledContainer>
//   );
// };

// export default EmptyCartModal;

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import CartTitle from "./CartTitle";
import CartDescription from "./CartDescription";

const StyledContainer = styled.div`
  width: 349px;
  height: 312px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 99px;
  right: 0;
  background-color: #1a1a1a96;
  backdrop-filter: blur(114px);
  border: 1px solid #ffffff12;
  border-radius: 17px;
  padding: 0;
  z-index: 1001;

  @media (max-width: 1080px) {
    position: fixed;
    width: 100%;
    bottom: 0;
    top: auto;
    right: 0;
    background-color: #1c1c1c;
    height: auto;
    padding: 19px 20px 72px 20px;
    border-radius: 14px 14px 0 0;
  }
`;

const StyledImage = styled.div`
  margin-top: 48px;

  @media (max-width: 1080px) {
    margin-top: 0;
  }
`;

const EmptyCartModal = () => {
  return (
    <StyledContainer>
      <StyledImage>
        <Image src="/assets/EmptyCartImage.svg" width={123} height={123} alt="cart-icon" />
      </StyledImage>
      <CartTitle text="კალათა ცარიელია" />
      <CartDescription text="დაამატე პროდუქტები ქალათში და გააფორმე შეკვეთა" />
    </StyledContainer>
  );
};

export default EmptyCartModal;
