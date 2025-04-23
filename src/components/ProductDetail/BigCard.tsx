import styled from "styled-components";
import SmallCard from "./SmallCard";

const StyleBigCard = styled.div`
  /* max-width: 100%; */
  width: 636px;
  height: 636px;
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
    width: 100%;
    height: 350px;
  }
`;

const InnerWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 16px;

  @media (max-width: 1080px) {
    gap: 8px;
    left: 13px;
    bottom: 14px;
  }
`;

const BigCard = () => {
  return (
    <StyleBigCard>
      <InnerWrapper>
        <SmallCard />
        <SmallCard />
        <SmallCard />
      </InnerWrapper>
    </StyleBigCard>
  );
};

export default BigCard;
