import styled from "styled-components";

const StyleSmallCard = styled.div`
  width: 120px;
  height: 120px;
  background: #1a1a1a96;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);

  @media (max-width: 1080px) {
    width: 64px;
    height: 64px;
  }
`;

const SmallCard = () => {
  return <StyleSmallCard></StyleSmallCard>;
};

export default SmallCard;
