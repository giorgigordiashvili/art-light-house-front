import React from "react";
import styled from "styled-components";
import AccomplishmentDescription from "./AccomplishmentDescription";
import AccomplishmentTitle from "./AccomplishmentTitle";
import Counts from "./Counts";
import CountLine from "./CountLine";
import Container from "../ui/Container";

const StyledComponent = styled.div`
  @media (max-width: 1332px) {
    padding-inline: 20px;
  }

  @media (max-width: 1080px) {
    padding-inline: 0;
  }
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

  @media (max-width: 1080px) {
    padding: 25px 24px;
  }
  @media (max-width: 1332px) {
    padding-inline: 32px;
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
  return (
    <Container>
      <StyledComponent>
        <BorderWrapper>
          <StyledContainer>
            <AccomplishmentTitle text="ჩვენი მიღწევები" />
            <StyledDescription>
              <AccomplishmentDescription text="კმაყოფილი მომხმარებლები ჩვენი წარმატების საფუძველია. მათი პოზიტიური გამოცდილება და რეკომენდაციები ჩვენთვის ყველაზე დიდი პრემიებია." />
            </StyledDescription>
            <StyledCountsWrapper>
              <StyledCounts>
                <Counts count="140+" subTitle="შესრულებული პროექტი" />
              </StyledCounts>
              <StyledLine>
                <CountLine />
              </StyledLine>
              <StyledCounts>
                <Counts count="19" subTitle="პარტნიორი" />
              </StyledCounts>
              <StyledLine>
                <CountLine />
              </StyledLine>
              <StyledCounts>
                <Counts count="7" subTitle="მაღაზია" />
              </StyledCounts>
            </StyledCountsWrapper>
          </StyledContainer>
        </BorderWrapper>
      </StyledComponent>
    </Container>
  );
};

export default Accomplishments;
