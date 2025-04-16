import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  margin-top: 12px;
`;

type Props = {};

const ModalInput = (props: Props) => {
  return (
    <StyledContainer>
      <input
        type="text"
        style={{
          width: "460px",
          height: "50px",
          border: "1px solid #FFFFFF12",
          borderRadius: "10px",
          padding: "0 16px",
          fontSize: "16px",
          backgroundColor: "#2A2A2A96",
          color: "#fafafa",
          outline: "none",
          cursor: "pointer",
        }}
      />
    </StyledContainer>
  );
};

export default ModalInput;
