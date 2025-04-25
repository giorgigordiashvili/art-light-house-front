import React from "react";
import styled from "styled-components";

const StyledTitle = styled.p`
  font-family: Helvetica;
  font-weight: 300;
  font-size: 36px;
  line-height: 44px;
  letter-spacing: -2%;
  text-align: center;
  color: #ffffff;
  @media (max-width: 1080px) {
    font-size: 24px;
  }
`;

type Props = {
  text: string;
};

const AccomplishmentTitle = (props: Props) => {
  return <StyledTitle>{props.text}</StyledTitle>;
};

export default AccomplishmentTitle;
