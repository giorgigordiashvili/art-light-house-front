import styled from "styled-components";
import InputWithLabel from "./Input";
import SaveButton from "@/ProfileButton/Save";
import Cancel from "@/ProfileButton/Cancel";
const StylePass = styled.div`
  /* max-width: 100%; */
  width: 800px;
  height: 512px;
  padding: 24px;
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
    padding: 16px;
    height: 678px;
  }
`;
const InputsWrapper = styled.div`
  display: flex;
  gap: 24px;
`;
const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  flex: 1;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  position: absolute;
  bottom: 24px;
  right: 24px;

  @media (max-width: 1080px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    position: static;
  }
`;
const Title = styled.p`
  position: relative;
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
  padding-bottom: 24px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: -24px;
    right: -24px;
    height: 1px;
    background-color: #242424;
  }

  @media (max-width: 1080px) {
    font-size: 16px;
    padding-bottom: 12px;

    &::after {
      left: -16px;
      right: -16px;
    }
  }
`;

const Pass = () => {
  return (
    <StylePass>
      <Title>პაროლის ცვლილება</Title>
      <InputsWrapper>
        <LeftColumn>
          <InputWithLabel
            icon="/assets/icons/pass1.svg"
            label="ძველი პაროლი"
            placeholder="პაროლი"
          />
          <InputWithLabel
            icon="/assets/icons/pass2.svg"
            label="შეიყვანეთ ახალი პაროლი"
            placeholder="ახალი პაროლი"
          />
          <InputWithLabel
            icon="/assets/icons/pass2.svg"
            label="გაიმეორეთ ახალი პაროლი"
            placeholder="გაიმეორეთ პაროლი"
          />
        </LeftColumn>
      </InputsWrapper>

      <ButtonRow>
        <Cancel />
        <SaveButton />
      </ButtonRow>
    </StylePass>
  );
};

export default Pass;
