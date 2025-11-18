import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 876px;
  background: #0b0b0b;
  overflow: hidden;
`;

const SkeletonBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(30, 30, 30, 0.6) 0%,
    rgba(20, 20, 20, 0.751907) 44.74%,
    rgba(15, 15, 15, 0.84574) 55.23%,
    #0b0b0b 63.52%
  );
`;

const SkeletonContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  padding-top: 210px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  @media (max-width: 1080px) {
    padding-top: 181px;
  }
`;

const SkeletonTitle = styled.div`
  width: 600px;
  height: 80px;
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
  background-size: 2000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 8px;
  margin-bottom: 38px;

  @media (max-width: 1080px) {
    width: 90%;
    height: 60px;
    margin-bottom: 20px;
  }
`;

const SkeletonDescription = styled.div`
  width: 800px;
  height: 60px;
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
  background-size: 2000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 8px;
  margin-bottom: 70px;

  @media (max-width: 1080px) {
    width: 90%;
    height: 40px;
    margin-bottom: 43px;
  }
`;

const SkeletonButton = styled.div`
  width: 200px;
  height: 50px;
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
  background-size: 2000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 25px;

  @media (max-width: 1080px) {
    width: 160px;
    height: 45px;
  }
`;

const SkeletonNav = styled.div`
  position: absolute;
  top: 50%;
  width: 40px;
  height: 40px;
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
  background-size: 2000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 50%;
  transform: translateY(-50%);

  &.left {
    left: 80px;
    @media (max-width: 1080px) {
      left: 20px;
    }
  }

  &.right {
    right: 80px;
    @media (max-width: 1080px) {
      right: 20px;
    }
  }
`;

const HeroSkeleton = () => {
  return (
    <SkeletonWrapper>
      <SkeletonBackground />
      <SkeletonContent>
        <SkeletonTitle />
        <SkeletonDescription />
        <SkeletonButton />
      </SkeletonContent>
      <SkeletonNav className="left" />
      <SkeletonNav className="right" />
    </SkeletonWrapper>
  );
};

export default HeroSkeleton;
