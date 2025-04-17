import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

type Props = {}

const CheckMarkIcon = (props: Props) => {
  return (
    <Image src={"/assets/check-mark.svg"} width={102} height={102} alt='checkmark-icon'/>
  )
}

export default CheckMarkIcon