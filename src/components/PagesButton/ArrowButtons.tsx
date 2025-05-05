import styled from "styled-components";
import Image from "next/image";
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
      <Image src={"/assets/leftArrow.svg"} alt="Left arrow" width={24} height={24} />
    </LeftArrowButton>
  );
};

export const RightArrow = () => {
  return (
    <RightArrowButton>
      <Image src={"/assets/icons/Chevron.svg"} alt="Right arrow" width={24} height={24} />
    </RightArrowButton>
  );
};
