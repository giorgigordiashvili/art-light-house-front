// import React from "react";
// import styled from "styled-components";
// import CartProduct from "./CartProduct";
// import PrimaryButton from "../Buttons/PrimaryButton";
// import SummaryPrice from "./SummaryPrice";

// const StyledContainer = styled.div`
//   width: 349px;
//   height: 415px;
//   display: flex;
//   flex-direction: column;
//   position: fixed;
//   top: 99px;
//   background-color: #1a1a1a96;
//   backdrop-filter: blur(114px);
//   border: 1px solid #ffffff12;
//   border-radius: 17px;
//   padding: 0;
//   z-index: 1001;

//   @media (max-width: 1332px) {
//     right: 20px;
//   }

//   @media (max-width: 1080px) {
//     right: 0;
//     width: 100%;
//     bottom: 0;
//     top: auto;
//     border-radius: 0;
//     border-top-left-radius: 17px;
//     border-top-right-radius: 17px;
//   }
// `;

// const StyledSpanContainer = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: flex-start;
//   padding-top: 20px;
//   padding-left: 20px;
// `;

// const StyledSpan = styled.span`
//   color: #fff;
//   display: flex;
//   font-family: Helvetica;
//   font-weight: 500;
//   font-size: 16px;
//   line-height: 14px;
//   letter-spacing: 0%;
//   vertical-align: middle;
// `;

// const ModalLayoutWrapper = styled.div`
//   width: 100%;
//   margin: auto;
// `;

// const ModalLayout = styled.div`
//   width: 1292px;
//   display: flex;
//   justify-content: flex-end;
// `;

// const ProductList = styled.div`
//   margin-top: 19px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 10px;
//   overflow-y: overlay;
//   max-height: 242px;
//   box-sizing: border-box;
//   scrollbar-width: none;
// `;

// const ProductWrapper = styled.div`
//   flex-shrink: 0;
//   @media (max-width: 1080px) {
//     width: 100%;
//     padding-inline: 12px;
//   }
// `;

// const StyledButton = styled.div`
//   margin-top: 24px;
//   display: flex;
//   justify-content: center;
//   @media (max-width: 1080px) {
//     padding-inline: 16px;
//   }
// `;

// const CartModal = ({ itemCount }: { itemCount: number }) => {
//   return (
//     <ModalLayoutWrapper>
//       <ModalLayout>
//         <StyledContainer>
//           <StyledSpanContainer>
//             <StyledSpan>{itemCount} პროდუქტები</StyledSpan>
//           </StyledSpanContainer>
//           <ProductList>
//             {Array.from({ length: itemCount }).map((_, index) => (
//               <ProductWrapper key={index}>
//                 <CartProduct />
//               </ProductWrapper>
//             ))}
//           </ProductList>
//           <SummaryPrice />
//           <StyledButton>
//             <PrimaryButton text="კალათაში გადასვლა" height="50px" width="317px" media="full" />
//           </StyledButton>
//         </StyledContainer>
//       </ModalLayout>
//     </ModalLayoutWrapper>
//   );
// };

// export default CartModal;
"use client";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import CartProduct from "./CartProduct";
import PrimaryButton from "../Buttons/PrimaryButton";
import SummaryPrice from "./SummaryPrice";

const StyledContainer = styled.div`
  width: 349px;
  height: 415px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 99px;
  background-color: #1a1a1a96;
  backdrop-filter: blur(114px);
  border: 1px solid #ffffff12;
  border-radius: 17px;
  padding: 0;
  z-index: 1001;

  @media (max-width: 1332px) {
    right: 20px;
  }

  @media (max-width: 1080px) {
    right: 0;
    width: 100%;
    bottom: 0;
    top: auto;
    border-radius: 0;
    border-top-left-radius: 17px;
    border-top-right-radius: 17px;
  }
`;

const StyledSpanContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-top: 20px;
  padding-left: 20px;
`;

const StyledSpan = styled.span`
  color: #fff;
  display: flex;
  font-family: Helvetica;
  font-weight: 500;
  font-size: 16px;
  line-height: 14px;
  letter-spacing: 0%;
  vertical-align: middle;
`;

const ModalLayoutWrapper = styled.div`
  width: 100%;
  margin: auto;
`;

const ModalLayout = styled.div`
  width: 1292px;
  display: flex;
  justify-content: flex-end;
`;

const ProductList = styled.div`
  margin-top: 19px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  overflow-y: overlay;
  max-height: 242px;
  box-sizing: border-box;
  scrollbar-width: none;
`;

const ProductWrapper = styled.div`
  flex-shrink: 0;
  @media (max-width: 1080px) {
    width: 100%;
    padding-inline: 12px;
  }
`;

const StyledButton = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  @media (max-width: 1080px) {
    padding-inline: 16px;
  }
`;

const CartModal = ({ itemCount }: { itemCount: number }) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/favorites");
  };

  return (
    <ModalLayoutWrapper>
      <ModalLayout>
        <StyledContainer>
          <StyledSpanContainer>
            <StyledSpan>{itemCount} პროდუქტები</StyledSpan>
          </StyledSpanContainer>
          <ProductList>
            {Array.from({ length: itemCount }).map((_, index) => (
              <ProductWrapper key={index}>
                <CartProduct />
              </ProductWrapper>
            ))}
          </ProductList>
          <SummaryPrice />
          <StyledButton>
            <PrimaryButton
              text="კალათაში გადასვლა"
              height="50px"
              width="317px"
              media="full"
              onClick={handleRedirect}
            />
          </StyledButton>
        </StyledContainer>
      </ModalLayout>
    </ModalLayoutWrapper>
  );
};

export default CartModal;
