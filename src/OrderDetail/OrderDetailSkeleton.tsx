import styled from "styled-components";

const StyleContainer = styled.div`
  width: calc(100% - 148px);
  max-width: 1294px;
  min-height: 1069px;
  padding: 78px 104px;
  background: #1a1a1a96;
  border-radius: 17px;
  display: flex;
  flex-direction: column;
  margin-top: 174px;
  margin-bottom: 209px;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  z-index: 1;
  @media (max-width: 1080px) {
    width: calc(100% - 32px);
    padding: 16px 16px;
  }
`;

const SkeletonTitle = styled.div`
  width: 280px;
  height: 34px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 47px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  @media (max-width: 1080px) {
    width: 200px;
    height: 28px;
    margin-bottom: 32px;
  }
`;

const SectionTitle = styled.div`
  width: 180px;
  height: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  margin-bottom: 20px;
  margin-top: 44px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  @media (max-width: 1080px) {
    width: 140px;
    height: 18px;
    margin-top: 32px;
  }
`;

const ProductsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  max-width: 1084px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonProductCard = styled.div`
  background: #2a2a2a96;
  padding: 20px;
  border-radius: 17px;
  width: 100%;
  max-width: 532px;
  height: 113px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 24px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
    z-index: 1;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  @media (max-width: 1080px) {
    max-width: none;
  }
`;

const SkeletonProductImage = styled.div`
  width: 73px;
  height: 73px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  flex-shrink: 0;
`;

const SkeletonProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
  flex-grow: 1;
`;

const SkeletonProductTitle = styled.div`
  width: 70%;
  height: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const SkeletonProductPrice = styled.div`
  width: 40%;
  height: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const SkeletonAddressCard = styled.div`
  background: #2a2a2a96;
  padding: 20px;
  border-radius: 17px;
  width: 100%;
  max-width: 532px;
  min-height: 100px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
    z-index: 1;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  @media (max-width: 1080px) {
    max-width: none;
  }
`;

const SkeletonAddressLine = styled.div<{ $width?: string }>`
  width: ${(props) => props.$width || "100%"};
  height: 14px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkeletonDeliveryCard = styled.div`
  background: #2a2a2a96;
  padding: 20px;
  border-radius: 17px;
  width: 100%;
  max-width: 532px;
  min-height: 80px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
    z-index: 1;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  @media (max-width: 1080px) {
    max-width: none;
  }
`;

const SkeletonSummaryBlock = styled.div`
  background: #2a2a2a96;
  padding: 24px;
  border-radius: 17px;
  width: 100%;
  max-width: 532px;
  min-height: 200px;
  margin-top: 44px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
    z-index: 1;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  @media (max-width: 1080px) {
    max-width: none;
  }
`;

const SkeletonSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const SkeletonSummaryText = styled.div<{ $width?: string }>`
  width: ${(props) => props.$width || "100px"};
  height: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
`;

const OrderDetailSkeleton = () => {
  return (
    <StyleContainer>
      <SkeletonTitle />

      <SectionTitle />
      <ProductsWrapper>
        {[1, 2, 3, 4].map((index) => (
          <SkeletonProductCard key={`product-${index}`}>
            <SkeletonProductImage />
            <SkeletonProductInfo>
              <SkeletonProductTitle />
              <SkeletonProductPrice />
            </SkeletonProductInfo>
          </SkeletonProductCard>
        ))}
      </ProductsWrapper>

      <SectionTitle />
      <SkeletonAddressCard>
        <SkeletonAddressLine $width="60%" />
        <SkeletonAddressLine $width="80%" />
        <SkeletonAddressLine $width="70%" />
      </SkeletonAddressCard>

      <SectionTitle />
      <SkeletonDeliveryCard>
        <SkeletonAddressLine $width="50%" />
        <SkeletonAddressLine $width="40%" />
      </SkeletonDeliveryCard>

      <SkeletonSummaryBlock>
        <SkeletonSummaryRow>
          <SkeletonSummaryText $width="120px" />
          <SkeletonSummaryText $width="80px" />
        </SkeletonSummaryRow>
        <SkeletonSummaryRow>
          <SkeletonSummaryText $width="140px" />
          <SkeletonSummaryText $width="80px" />
        </SkeletonSummaryRow>
        <SkeletonSummaryRow>
          <SkeletonSummaryText $width="100px" />
          <SkeletonSummaryText $width="90px" />
        </SkeletonSummaryRow>
      </SkeletonSummaryBlock>
    </StyleContainer>
  );
};

export default OrderDetailSkeleton;
