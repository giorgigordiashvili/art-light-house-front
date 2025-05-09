import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 13px;
  line-height: 159%;
  letter-spacing: 0px;
  vertical-align: middle;
  color: #ffffff;
`;

type Props = {
  text: string;
};

const AddressCardTitle = (props: Props) => {
  return <StyledContainer>{props.text}</StyledContainer>;
};

export default AddressCardTitle;
