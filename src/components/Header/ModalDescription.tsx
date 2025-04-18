import React from 'react';
import styled, { css } from 'styled-components';

type StyledProps = {
    variant?: 'default' | 'alt' | 'strong';
};

const StyledContainer = styled.div<StyledProps>`
  ${(props) => {
    switch (props.variant) {
      case 'alt':
        return css`
          font-family: 'Helvetica';
          font-weight: 400;
          font-size: 14px;
          line-height: 24px;
          letter-spacing: 0%;
          text-align: center;
          color: #FFFFFF;
          @media (max-width: 1080px) {
            font-size: 18px;
          }
        `;
      case 'strong':
        return css`
          font-family: 'Helvetica';
          font-weight: 500;
          font-size: 18px;
          line-height: 24px;
          letter-spacing: 0%;
          text-align: center;
          color: #FFFFFF;
        `;
      default:
        return css`
          font-family: 'Helvetica';
          font-weight: 300;
          font-size: 13px;
          line-height: 100%;
          letter-spacing: 0%;
          color: #FFFFFF;
          @media (max-width: 1080px) {
            font-size: 18px;
          }
        `;
    }
  }}
`;

type Props = {
  text: string;
  variant?: 'default' | 'alt' | 'strong';
};

const ModalDescription = ({ text, variant = 'default' }: Props) => {
  return <StyledContainer variant={variant}>{text}</StyledContainer>;
};

export default ModalDescription;
