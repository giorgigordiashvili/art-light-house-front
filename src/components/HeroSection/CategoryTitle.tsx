import React from "react";
import styled from "styled-components";
import Image from "next/image";

const StyledContainer = styled.div`
  display: flex;
  gap: 14px;
`;

const StyledText = styled.div`
  font-family: Helvetica;
  font-weight: 250;
  font-size: 34px;
  line-height: 24px;
  letter-spacing: 0%;
  color: #ffffff;
`;

type Props = {
  text: string;
};

const CategoryTitle: React.FC<Props> = (props) => {
  return (
    <>
      <StyledContainer>
        <Image src="/assets/stars.svg" alt="stars" width={32} height={32} />
        <StyledText>{props.text}</StyledText>
      </StyledContainer>
    </>
  );
};

export default CategoryTitle;
