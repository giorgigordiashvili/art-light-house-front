import styled from "styled-components";

const Wrapper = styled.div`
  color: white;
  font-family: "Helvetica Neue LT GEO", sans-serif;
  max-width: 563px;
  @media (max-width: 1080px) {
    max-width: 100%;
    width: 100%;
  }
`;

const Title = styled.p`
  margin-bottom: 45px;
  font-weight: 300;
  font-size: 34px;
  line-height: 24px;
  letter-spacing: 0%;
  vertical-align: middle;
  @media (max-width: 1080px) {
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 18px;
  }
`;

const Price = styled.p`
  margin-bottom: 34px;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  letter-spacing: 0%;
  vertical-align: middle;
  @media (max-width: 1080px) {
    font-size: 28px;
    line-height: 48px;
    margin-bottom: 24px;
  }
`;

const Description = styled.p`
  font-weight: 300;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0%;
  @media (max-width: 1080px) {
    font-size: 13px;
    line-height: 24px;
  }
`;

const DetailDescription = () => {
  return (
    <Wrapper>
      <Title>ლურჯი ვარსკვლავის ჭაღი</Title>
      <Price>199,99 ₾</Price>
      <Description>
        ეს ჭაღი შექმნილია თანამედროვე დიზაინის მიხედვით და იდეალურად შეესაბამება ნებისმიერი
        ინტერიერის სტილს. მისი უნიკალური ფორმა და ლურჯი ფერის ელემენტები ქმნიან განსაკუთრებულ
        ატმოსფეროს თქვენს სახლში. ჭაღი აღჭურვილია ენერგოეფექტური LED ნათურებით, რაც უზრუნველყოფს
        ხანგრძლივ მომსახურებას და დაბალ ენერგომოხმარებას. შეიძინეთ ახლა ჩვენს ვებსაიტზე და
        გაამდიდრეთ თქვენი სივრცე!
      </Description>
    </Wrapper>
  );
};

export default DetailDescription;
