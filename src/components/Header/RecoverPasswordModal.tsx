import React from 'react';
import styled from 'styled-components';
import InputTitle from './InputTitle';
import ModalInput from './ModalInput';
import CloseIcon from './CloseIcon';
import ModalDescription from './ModalDescription';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import ModalTitle from './ModalTitle';

const StyledContainer = styled.div`
    padding: 30px 24px 35px 24px;
    background-color: #1C1C1C;
    border-radius: 20px;
    position: fixed;
    top: 93px;
    left: 50%;
    transform: translate(-50%);
    z-index: 1002;
`;

const StyledCloseIcon = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
`;

const StyledTitle = styled.div`
    display: flex;
    justify-content: center;
`

const StyledDescription = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 19px;
`

const StyledPrimaryButton = styled.div`
    margin-top: 25px;
`

const StyledInput = styled.div`
    margin-top: 48px;
`

const RecoverPasswordModal = () => {
    return (
        <StyledContainer>
            <StyledCloseIcon>
                <CloseIcon />
            </StyledCloseIcon>
            <StyledTitle>
                <ModalTitle text='პაროლის აღდგენა' />
            </StyledTitle>
            <StyledDescription>
                <ModalDescription text='პაროლის აღსადგენად ჩაწერეთ რეგისტრირებული ელ.ფოსტა' />
            </StyledDescription>
            <StyledInput>
                <InputTitle text='პაროლის აღდგენა' />
                <ModalInput placeholder='შეიყვანეთ ელ.ფოსტა'/>
            </StyledInput>
            <StyledPrimaryButton>
                <PrimaryButton text='გაგზავნა' width='460px' height='50px' />
            </StyledPrimaryButton>
        </StyledContainer>
    )
}

export default RecoverPasswordModal