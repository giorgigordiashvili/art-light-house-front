import styled from "styled-components";
import Image from "next/image";

const Card = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  background: #2a2a2a96;
  padding: 24px;
  border-radius: 17px;
  color: white;
  width: 100%;
  max-width: 349px;
  height: 96px;
  position: relative;
  border: 1px solid #ffffff12;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 30px;
  border: 1px solid #ffffff1a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 13px;
  flex-grow: 1;
  align-items: flex-start;
`;

const Title = styled.span`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 13px;
  color: #ffffff;
  margin-bottom: 3px;
`;

const Time = styled.span`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 13px;
  color: #ffffff;
`;

const RadioIndicator = styled.div<{ $selected: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ $selected }) => ($selected ? "#FFCB40" : "#fff")};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    width: 7.5px;
    height: 7.5px;
    background-color: ${({ $selected }) => ($selected ? "#FFCB40" : "transparent")};
    border-radius: 50%;
  }
`;

interface Props {
  method: string;
  desc: string;
  imageSrc: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean; // ახალი: თუ მონიშვნის უფლებას არ აძლევს
}

const DeliveryOptionCard = ({ method, desc, imageSrc, selected, onSelect, disabled }: Props) => {
  return (
    <Card
      $selected={selected}
      onClick={() => {
        if (!disabled) {
          onSelect();
        }
      }}
      style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1 }}
    >
      <IconWrapper>
        <Image src={imageSrc} alt="icon" width={24} height={24} />
      </IconWrapper>
      <InfoWrapper>
        <Title>{method}</Title>
        <Time>{desc}</Time>
      </InfoWrapper>
      <RadioIndicator $selected={selected} />
    </Card>
  );
};
export default DeliveryOptionCard;
