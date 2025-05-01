import styled from "styled-components";

const StyleContainer = styled.div`
  /* max-width: 100%; */
  width: 800px;
  height: 544px;
  background: #1a1a1a96;
  border-radius: 17px;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);

  @media (max-width: 1080px) {
    max-width: 100%;
    /* width: 100%; */
    height: 678px;
  }
`;

const Container = () => {
  return <StyleContainer></StyleContainer>;
};

export default Container;
