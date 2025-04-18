import styled from "styled-components";

const ArrowButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: #1a1a1a96;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 24px;
    height: 24px;
  }
`;

const LeftArrowButton = styled(ArrowButton)`
  left: 711px;
`;

const RightArrowButton = styled(ArrowButton)`
  left: 1009px;
`;

export const LeftArrow = () => {
  return (
    <LeftArrowButton>
      <img src={"/assets/leftArrow.svg"} alt="Left arrow" />
    </LeftArrowButton>
  );
};

export const RightArrow = () => {
  return (
    <RightArrowButton>
      <img src={"/assets/rightArrow.svg"} alt="Right arrow" />
    </RightArrowButton>
  );
};
