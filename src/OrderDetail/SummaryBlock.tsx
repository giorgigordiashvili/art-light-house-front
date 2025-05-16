import styled from "styled-components";

const SummaryContainer = styled.div`
  max-width: 532px;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: white;
  font-family: Helvetica;
  margin-top: 44px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  line-height: 24px;
  margin-bottom: 20px;
`;

const TotalLabel = styled.span`
  font-weight: 300;
  font-variant-numeric: stacked-fractions;
`;

const TotalPrice = styled.span`
  font-weight: 500;
  font-variant-numeric: stacked-fractions;
  text-align: right;
`;

const Divider = styled.hr`
  max-width: 532px;
  width: 100%;
  border: 1px solid #242424;
  margin-bottom: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 12px;
`;

const DetailLabel = styled.span`
  font-weight: 300;
  font-variant-numeric: stacked-fractions;
  vertical-align: middle;
`;

const DetailPrice = styled.span`
  font-weight: 500;
  text-align: right;
  font-variant-numeric: stacked-fractions;
  vertical-align: middle;
`;

const SummaryBlock = () => {
  return (
    <SummaryContainer>
      <TotalRow>
        <TotalLabel>ჯამი</TotalLabel>
        <TotalPrice>499,99 ₾</TotalPrice>
      </TotalRow>

      <Divider />

      <DetailRow>
        <DetailLabel>პროდუქტის ღირებულება</DetailLabel>
        <DetailPrice>499,99 ₾</DetailPrice>
      </DetailRow>
      <DetailRow>
        <DetailLabel>მიტანის სერვისი</DetailLabel>
        <DetailPrice>14,99 ₾</DetailPrice>
      </DetailRow>
      <DetailRow>
        <DetailLabel>სერვისის საკომისიო</DetailLabel>
        <DetailPrice>2,99 ₾</DetailPrice>
      </DetailRow>
    </SummaryContainer>
  );
};

export default SummaryBlock;
