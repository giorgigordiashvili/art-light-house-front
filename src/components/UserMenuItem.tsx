import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

interface StyledContainerProps {
    textcolor?: string;
}

const StyledContainer = styled.div<StyledContainerProps>`
  height: 66px;
  padding: 24px 0 18px 24px;
  font-family: HelRom;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: 0%;
  display: flex;
  align-items: center;
  gap: 18px;
  color: ${(props) => props.textcolor || '#EDEDEDCC'};
`;

type Props = {
    text: string;
    icon: string;
    color?: 'white' | 'red';
};

const UserMenuItem = ({ text, icon, color }: Props) => {
    const textcolor = color === 'white' ? 'white' : color === 'red' ? '#FF4545' : undefined;

    return (
        <StyledContainer textcolor={textcolor}>
            <Image src={icon} alt="menu icon" width={24} height={24} />
            <p>{text}</p>
        </StyledContainer>
    );
};

export default UserMenuItem;