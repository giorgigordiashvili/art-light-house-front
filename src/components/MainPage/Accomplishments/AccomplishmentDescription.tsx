import React from "react";
import styled from "styled-components";

const StyledDescription = styled.p`
  font-family: Helvetica;
  font-weight: 250;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 0%;
  text-align: center;
  color: #ffffff;
  max-width: 768px;
  @media (max-width: 1080px) {
    font-size: 12px;
    line-height: 21px;
  }
`;

type Props = {
  text: string;
};

const AccomplishmentDescription = (props: Props) => {
  return <StyledDescription>{props.text}</StyledDescription>;
};

export default AccomplishmentDescription;
