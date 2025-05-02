import styled from "styled-components";
import InputWithLabel from "./Input";
const StyleContainer = styled.div`
  /* max-width: 100%; */
  width: 800px;
  height: 544px;
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

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  flex: 1;
`;

const Container = () => {
  return (
    <StyleContainer>
      <InputsWrapper>
        <LeftColumn>
          <InputWithLabel label="სახელი" placeholder="სახელი" />
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
          <InputWithLabel label="გვარი" placeholder="გვარი" />
          <InputWithLabel
            icon="/assets/icons/phone icon.svg"
            label="ტელეფონის ნომერი"
            placeholder="შეიყვანეთ ტელეფონის ნომერი"
          />
        </RightColumn>
      </InputsWrapper>
    </StyleContainer>
  );
};

export default Container;
