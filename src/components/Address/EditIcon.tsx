// import React from "react";
// import styled from "styled-components";
// import Image from "next/image";

// const StyledContainer = styled.div`
//   padding: 9px;
//   border-radius: 50%;
//   border: 1px solid #ffffff1a;
//   width: 40px;
//   height: 40px;
// `;
// type Props = {};

// const EditIcon = (props: Props) => {
//   return (
//     <StyledContainer>
//       <Image src={"/assets/Edit.svg"} width={24} height={24} alt="add-icon" />
//     </StyledContainer>
//   );
// };

// export default EditIcon;

import React from "react";
import styled from "styled-components";
import Image from "next/image";

const StyledContainer = styled.div`
  padding: 9px;
  border-radius: 50%;
  border: 1px solid #ffffff1a;
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

type Props = {
  onClick?: () => void;
};

const EditIcon = ({ onClick }: Props) => {
  return (
    <StyledContainer onClick={onClick}>
      <Image src="/assets/Edit.svg" width={24} height={24} alt="edit-icon" />
    </StyledContainer>
  );
};

export default EditIcon;
