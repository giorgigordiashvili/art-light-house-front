  "use client";
  import styled from "styled-components";

  const BottomWrapper = styled.div`
    margin-top: 32px;
    font-size: 12px;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
  `;

  const Copyright = styled.div`
    width: 189px;
    height: 24px;
    font-weight: 300;
    font-family: Helvetica Neue LT GEO;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0%;
  `;


  function FooterBottom() {
    return (
      <BottomWrapper>
        <Copyright>© 2025. All rights reserved.</Copyright>
      </BottomWrapper>
    );
  }

  export default FooterBottom;
