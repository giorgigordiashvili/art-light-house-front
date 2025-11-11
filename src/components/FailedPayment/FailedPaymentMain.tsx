"use client";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const StyleContainer = styled.div`
  width: calc(100% - 148px);
  max-width: 800px;
  min-height: 500px;
  padding: 78px 104px;
  background: #1a1a1a96;
  border-radius: 17px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 174px;
  margin-bottom: 209px;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);
  position: relative;

  @media (max-width: 1080px) {
    width: calc(100% - 32px);
    padding: 40px 16px;
    margin-top: 100px;
    margin-bottom: 100px;
  }
`;

const ErrorIcon = styled.img`
  position: absolute;
  top: -87.5px;
  left: 50%;
  transform: translateX(-50%);
  width: 175px;
  height: 175px;
  z-index: 10;

  @media (max-width: 1080px) {
    top: -68.5px;
    width: 137px;
    height: 137px;
  }
`;

const Title = styled.h1`
  color: #ff4444;
  font-size: 34px;
  font-weight: 400;
  margin-bottom: 24px;
  text-align: center;

  @media (max-width: 1080px) {
    font-size: 24px;
    margin-bottom: 16px;
  }
`;

const Message = styled.p`
  color: #ffffff;
  font-size: 18px;
  font-weight: 300;
  text-align: center;
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 500px;

  @media (max-width: 1080px) {
    font-size: 16px;
    margin-bottom: 32px;
  }
`;

const ReturnButton = styled.button`
  background: #ffcb40;
  color: #0b0b0b;
  font-size: 16px;
  font-weight: 500;
  padding: 16px 48px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e6b233;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 1080px) {
    padding: 14px 40px;
    font-size: 14px;
  }
`;

const Container = ({ dictionary }: { dictionary: any }) => {
  const router = useRouter();

  const handleReturnHome = () => {
    // Get current language from URL
    const currentLang = window.location.pathname.split("/")[1];
    const lang = ["en", "ge"].includes(currentLang) ? currentLang : "ge";
    router.push(`/${lang}`);
  };

  return (
    <StyleContainer>
      <ErrorIcon src="/assets/icons/error-circle.svg" alt="Error" />
      <Title>{dictionary?.failedPayment?.title}</Title>
      <Message>{dictionary?.failedPayment?.message}</Message>
      <ReturnButton onClick={handleReturnHome}>{dictionary?.failedPayment?.button}</ReturnButton>
    </StyleContainer>
  );
};

export default Container;
