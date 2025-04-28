// import React from "react";
// import Image from "next/image";
// import styled from "styled-components";

// const StyledContainer = styled.div`
//   position: relative;
//   display: inline-block;
//   cursor: pointer;
// `;

// const StyledCount = styled.div`
//   position: absolute;
//   top: -8px;
//   right: -8px;
//   background-color: red;
//   color: white;
//   border-radius: 50%;
//   padding: 2.5px 5.6px;
//   font-size: 14px;
//   font-weight: 700;
//   line-height: 100%;
//   text-align: center;
// `;

// type Props = {
//   itemCount?: number;
// };

// const ShoppingCartIcon = ({ itemCount = 0 }: Props) => {
//   return (
//     <StyledContainer>
//       <Image src="/assets/CartIcon.svg" alt="shopping-cart-icon" width={24} height={24} />
//       {itemCount > 0 && <StyledCount>{itemCount}</StyledCount>}
//     </StyledContainer>
//   );
// };

// export default ShoppingCartIcon;

// ShoppingCartIcon.tsx
import React from "react";
import Image from "next/image";
import styled from "styled-components";

const StyledContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

const StyledCount = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2.5px 5.6px;
  font-size: 14px;
  font-weight: 700;
  line-height: 100%;
  text-align: center;
`;

type Props = {
  itemCount?: number;
  onClick?: () => void;
};

const ShoppingCartIcon = ({ itemCount = 0, onClick }: Props) => {
  return (
    <StyledContainer onClick={onClick}>
      <Image src="/assets/CartIcon.svg" alt="shopping-cart-icon" width={24} height={24} />
      {itemCount > 0 && <StyledCount>{itemCount}</StyledCount>}
    </StyledContainer>
  );
};

export default ShoppingCartIcon;
