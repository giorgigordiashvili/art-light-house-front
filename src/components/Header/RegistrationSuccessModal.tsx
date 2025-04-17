import React from 'react';
import styled from 'styled-components';
import CloseIcon from './CloseIcon';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import ModalDescription from './ModalDescription';
import CheckMarkIcon from './CheckMarkIcon';


const StyledContainer = styled.div`
    padding: 37px 39px 62px 39px;
    background-color: #1C1C1C;
    border-radius: 20px;
    position: fixed;
    top: 93px;
    left: 50%;
    transform: translate(-50%);
    z-index: 1002;
`
const StyledCloseIcon = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
`;

const StyledCheckMark = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledStrongDescription = styled.div`
  margin-top: 32px;
`;

const StyledDescription = styled.div`
  margin-top: 11px;
  max-width: 430px;
`;

const StyledPrimaryButton = styled.div`
  display: flex;
  justify-content: center;  
  margin-top: 69px;
`;

const RegistrationSuccessModal = () => {
  return (
    <StyledContainer>
      <StyledCheckMark>
        <CheckMarkIcon />
      </StyledCheckMark>
      <StyledCloseIcon>
        <CloseIcon />
      </StyledCloseIcon>
      <StyledStrongDescription>
        <ModalDescription text='რეგისტრავია წატმატებით გაიარე.' variant='strong' />
      </StyledStrongDescription>
      <StyledDescription>
        <ModalDescription text='ახლა უკვე შეგიძლია თავისუფლად შეუკვეთო პროდუქტები რომლებსაც შენთვის აარჩევ' variant='alt' />
      </StyledDescription>
      <StyledPrimaryButton>
        <PrimaryButton text='მთავარზე დაბრუნება' width='242px' height='50px'/>
      </StyledPrimaryButton>
    </StyledContainer>
  )
}

export default RegistrationSuccessModal