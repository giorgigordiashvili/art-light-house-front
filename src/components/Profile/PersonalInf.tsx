import styled from "styled-components";
import InputWithLabel from "./Input";
import SaveButton from "@/ProfileButton/Save";
import Cancel from "@/ProfileButton/Cancel";
const StylePersonal = styled.div`
  /* width: 800px; */
  width: 100%;
  max-width: 100%;
  min-height: 544px;
  padding: 24px;
  background: #1a1a1a96;
  border-radius: 17px;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid #ffffff12;
  backdrop-filter: blur(114px);

  @media (max-width: 1080px) {
    width: 100%;
    padding: 16px;
    min-height: auto;
  }
`;

const InputsWrapper = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  flex: 1;
`;

const RightColumn = styled.div`
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
    margin-top: 24px;
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

const Personal = () => {
  return (
    <StylePersonal>
      <Title>პერსონალური ინფორმაცია</Title>
      <InputsWrapper>
        <LeftColumn>
          <InputWithLabel label="სახელი" placeholder="სახელი" gap={12} />
          <InputWithLabel
            icon="/assets/icons/Field Icon.svg"
            label="დაბადების თარითი"
            placeholder="შეირჩეთ თარიღი"
          />
          <InputWithLabel
            icon="/assets/icons/gmail.svg"
            label="ელ.ფოსტა"
            placeholder="yourmail@gmail.com"
          />
        </LeftColumn>

        <RightColumn>
          <InputWithLabel label="გვარი" placeholder="გვარი" gap={12} />
          <InputWithLabel
            icon="/assets/icons/phone icon.svg"
            label="ტელეფონის ნომერი"
            placeholder="შეიყვანეთ ტელეფონის ნომერი"
          />
        </RightColumn>
      </InputsWrapper>

      <ButtonRow>
        <Cancel />
        <SaveButton />
      </ButtonRow>
    </StylePersonal>
  );
};

export default Personal;
