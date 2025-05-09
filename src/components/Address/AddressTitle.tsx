import React from "react";
import styled from "styled-components";

const StyledText = styled.p`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 18px;
  line-height: 36px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: #fafafa;
  padding: 24px 0 24px 24px;
`;

type Props = {
  text: string;
};

const AddressTitle = (props: Props) => {
  return <StyledText>{props.text}</StyledText>;
};

export default AddressTitle;
