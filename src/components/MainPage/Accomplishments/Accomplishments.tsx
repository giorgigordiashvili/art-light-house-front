import React from "react";
import styled from "styled-components";
import AccomplishmentDescription from "./AccomplishmentDescription";
import AccomplishmentTitle from "./AccomplishmentTitle";
import Counts from "./Counts";
import CountLine from "./CountLine";
import Container from "../../ui/Container";
import Circle from "@/components/ui/Circle";
import { useLanguage } from "@/context/LanguageContext";

const StyledComponent = styled.div`
  position: relative;
  @media (max-width: 1332px) {
    padding-inline: 20px;
  }

  @media (max-width: 1080px) {
    padding-inline: 0;
  }
`;

const StyledLeftCircle = styled.div`
  position: absolute;
  bottom: 187px;
  left: -185px;
`;

const StyledRightCircle = styled.div`
  position: absolute;
  top: -30px;
  right: 284px;
`;

const BorderWrapper = styled.div`
  padding: 1px;
  background: linear-gradient(
    81.95deg,
    rgba(246, 202, 86, 0.45) 0%,
    rgba(246, 202, 86, 0.03818) 29.91%,
    rgba(246, 202, 86, 0) 52.42%,
    rgba(246, 202, 86, 0.0709686) 81.77%,
    rgba(246, 202, 86, 0.45) 100%
  );
  display: inline-block;
  border-radius: 32px;
  backdrop-filter: blur(114px);
  margin-top: 95px;
  width: 100%;
  max-width: 1292px;
  @media (max-width: 1080px) {
    margin-top: 76px;
  }
`;

const StyledContainer = styled.div`
  border-radius: 32px;
  background-color: #101010;
  width: 100%;
  padding: 96px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 1332px) {
    padding-inline: 32px;
  }
  @media (max-width: 1080px) {
    padding: 25px 30px 54px 30px;
  }
`;

const StyledCountsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 64px;
  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 32px;
    margin-top: 38px;
  }
`;

const StyledCounts = styled.div`
  width: 240px;
  height: 112px;
`;

const StyledDescription = styled.div`
  margin-top: 20px;
  @media (max-width: 1080px) {
    margin-top: 6px;
  }
`;

const StyledLine = styled.div`
  @media (max-width: 1080px) {
    display: none;
  }
`;

const Accomplishments = () => {
  const { dictionary } = useLanguage();
  return (
    <Container>
      <StyledComponent>
        <StyledLeftCircle>
          <Circle size="large" />
        </StyledLeftCircle>
        <StyledRightCircle>
          <Circle size="small" />
        </StyledRightCircle>
        <BorderWrapper>
          <StyledContainer>
            <AccomplishmentTitle text={dictionary.accomplihsments.title1} />
            <StyledDescription>
              <AccomplishmentDescription text={dictionary.accomplihsments.description} />
            </StyledDescription>
            <StyledCountsWrapper>
              <StyledCounts>
                <Counts count="140+" subTitle={dictionary.accomplihsments.done} />
              </StyledCounts>
              <StyledLine>
                <CountLine />
              </StyledLine>
              <StyledCounts>
                <Counts count="19" subTitle={dictionary.accomplihsments.parthner} />
              </StyledCounts>
              <StyledLine>
                <CountLine />
              </StyledLine>
              <StyledCounts>
                <Counts count="7" subTitle={dictionary.accomplihsments.shop} />
              </StyledCounts>
            </StyledCountsWrapper>
          </StyledContainer>
        </BorderWrapper>
      </StyledComponent>
    </Container>
  );
};

export default Accomplishments;
