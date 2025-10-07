import styled from "styled-components";
import Image from "next/image";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
`;

const Label = styled.span`
  font-family: Helvetica;
  font-weight: 500;
  font-size: 18px;
  line-height: 33.8px;
  letter-spacing: 0%;
  color: #ffffff;
  margin-top: 38px;
  margin-bottom: 18px;
  @media (max-width: 1080px) {
    margin-top: 34px;
    font-size: 16px;
  }
`;

const DeliveryCard = styled.div`
  display: flex;
  align-items: center;
  background: #2a2a2a96;
  padding: 26px 20px;
  border-radius: 17px;
  color: white;
  width: 100%;
  height: 100px;
  position: relative;
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
  flex-grow: 1;
  margin-left: 20px;
`;

const Method = styled.span`
  font-family: Helvetica;
  font-weight: 700;
  font-size: 13px;
  color: #ffffff;
  margin-bottom: 3px;
`;

const Desc = styled.span`
  font-family: Helvetica;
  font-weight: 400;
  font-size: 13px;
  color: #ffffff;
  @media (max-width: 1080px) {
    display: none;
  }
`;
const Mobile = styled.div`
  display: none;
  cursor: pointer;
  @media (max-width: 1080px) {
    display: flex;
  }
`;

const ChangeButton = styled.button`
  background-color: transparent;
  color: white;
  width: 82px;
  height: 40px;
  border: 1px solid #ffffff17;
  border-radius: 90px;
  font-size: 13px;
  cursor: pointer;
  @media (max-width: 1080px) {
    display: none;
  }
`;

type CheckoutCardProps = {
  label: string;
  method: string;
  desc: string;
  imageSrc: string;
  onChangeClick?: () => void;
  showChangeButton?: boolean;
  dictionary?: any;
};

const CheckoutCard = ({
  label,
  method,
  desc,
  imageSrc,
  onChangeClick,
  showChangeButton = false,
  dictionary,
}: CheckoutCardProps) => {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <DeliveryCard>
        <IconWrapper>
          <Image src={imageSrc} alt="icon" width={24} height={24} />
        </IconWrapper>
        <InfoWrapper>
          <Method>{method}</Method>
          <Desc>{desc}</Desc>
        </InfoWrapper>
        {showChangeButton && (
          <>
            <ChangeButton onClick={onChangeClick}>
              {dictionary?.changeButton || "შეცვლა"}
            </ChangeButton>
            <Mobile onClick={onChangeClick}>
              <IconWrapper>
                <Image src="/assets/icons/edit.svg" alt="icon" width={24} height={24} />
              </IconWrapper>
            </Mobile>
          </>
        )}
      </DeliveryCard>
    </Wrapper>
  );
};

export default CheckoutCard;
