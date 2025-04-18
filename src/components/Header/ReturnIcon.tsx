import React from 'react'
import Image from 'next/image';
import styled from 'styled-components';

const StyledContainer = styled.div`
    width: 50px;
    padding: 13px;
    border: 1px solid #FFFFFF12;
    border-radius: 50%;
    backdrop-filter: blur(114px);
    color: #1A1A1A96;
`

const ReturnIcon = () => {
    return (
        <StyledContainer>
            <Image src={"/assets/returnIcon.svg"} width={24} height={24} alt='return-icon' />
        </StyledContainer>
    )
}

export default ReturnIcon