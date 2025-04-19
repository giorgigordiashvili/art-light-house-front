import styled from "styled-components";

const LineWrapper = styled.div`
  margin-left: -20px;
  margin-right: -20px;
  width: calc(100% + 40px);
  margin-bottom: 20px;
  margin-top: 20px;
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: #252524;
`;

const FullLine = () => (
  <LineWrapper>
    <Line />
  </LineWrapper>
);

export default FullLine;
