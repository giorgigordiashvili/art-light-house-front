"use client";
import styled from "styled-components";

const Links = styled.div`
  width: 458px;
  height: 168px;
  top: 64px;
  left: 908px;
  display: flex;
  gap: 64px;

  @media (max-width: 1080px) {
    flex-direction: column;
    gap: 32px;
    width: 100%;
    height: auto;
  }
`;

const Column = styled.div`
  width: 242px;
  height: 168px;
  min-width: 96px;

  p {
    margin-bottom: 16px;
    font-family: "Helvetica", sans-serif;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    white-space: nowrap;
    color: #ffffff;
  }
  @media (max-width: 1080px) {
    margin-top: 21px;
  }
`;

const Column1 = styled.div`
  width: 152px;
  height: 168px;
  min-width: 96px;

  p {
    margin-bottom: 16px;
    font-family: "Helvetica", sans-serif;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    white-space: nowrap;
    color: #ffffff;
  }
  @media (max-width: 1080px) {
    margin-top: 21px;
  }
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  font-size: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    cursor: pointer;
    transition: color 0.2s ease;

    a {
      color: inherit;
      text-decoration: none;
    }

    &:hover {
      color: #ffffff;
    }
  }
`;

function FooterLinks({ footer }: any) {
  return (
    <Links>
      <Column>
        <p>{footer?.footerNav1?.products || "Products"}</p>
        <LinkList>
          <li>{footer?.footerNav1?.kitchen || "Kitchen"}</li>
          <li>{footer?.footerNav1?.livingroom || "Living Room"}</li>
          <li>{footer?.footerNav1?.bedroom || "Bedroom"}</li>
          <li>{footer?.footerNav1?.childRoom || "Child's Room"}</li>
        </LinkList>
      </Column>

      <Column1>
        <p>{footer?.footerNav2?.socialMedia || "Social Networks"}</p>
        <LinkList>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              {footer?.footerNav2?.Twitter || "Twitter"}
            </a>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              {footer?.footerNav2?.Linkedin || "LinkedIn"}
            </a>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              {footer?.footerNav2?.Facebook || "Facebook"}
            </a>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer">
              {footer?.footerNav2?.GitHub || "GitHub"}
            </a>
          </li>
        </LinkList>
      </Column1>
    </Links>
  );
}

export default FooterLinks;
