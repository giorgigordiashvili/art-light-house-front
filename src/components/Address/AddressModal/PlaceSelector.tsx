import React from "react";
import styled from "styled-components";
import Image from "next/image";
import SelectorTitle from "./SelectorTitle";

const StyledContainer = styled.div`
  width: 460px;
  height: 59px;
  border: 1px solid #474748;
  border-radius: 20px;
  display: flex;
  align-items: center;
  overflow: hidden;
  @media (max-width: 1080px) {
    width: 100%;
  }
`;

interface StyledItemWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  label?: string;
}

const StyledItemWrapper = styled.div<StyledItemWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
  width: ${({ label }) => (label === "სამსახური" ? "159px" : "150px")};
  height: 59px;
  background: ${({ selected }) => (selected ? "#FFCB401A" : "transparent")};
  border-right: 1px solid #404143;

  &:last-child {
    border-right: none;
  }

  @media (max-width: 1080px) {
    width: 100%;
  }
`;

type Props = {
  selectedPlace: string;
  onSelect: (place: string) => void;
  dictionary: any;
};

const PlaceSelector = ({ selectedPlace, onSelect, dictionary }: Props) => {
  const items = [
    { icon: "/assets/home.svg", label: dictionary.addressOption1 },
    { icon: "/assets/briefcase.svg", label: dictionary.addressOption2 },
    { icon: "/assets/pin.svg", label: dictionary.addressOption3 },
  ];

  return (
    <StyledContainer>
      {items.map(({ icon, label }) => (
        <StyledItemWrapper
          key={label}
          selected={selectedPlace === label}
          onClick={() => onSelect(label)}
          label={label}
        >
          <Image src={icon} width={24} height={24} alt={label} />
          <SelectorTitle text={label} />
        </StyledItemWrapper>
      ))}
    </StyledContainer>
  );
};

export default PlaceSelector;
