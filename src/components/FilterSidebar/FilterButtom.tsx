import { useState } from "react";
import styled from "styled-components";

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  background-color: #1c2526;
  color: #ffffff;
  border: none;
  border-radius: 17px;
  padding: 20px 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 129px;
  height: 52px;

  &:hover {
    background-color: #2a3435;
  }
`;

const FilterIcon = styled.img`
  width: 20px;
  height: 20px;
`;

interface FilterButtonProps {
  label?: string;
  onClick?: () => void;
  iconSrc?: string;
  iconAlt?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label = "ფილტრი",
  onClick,
  iconSrc = "/assets/icons/filter.svg",
  iconAlt = "icon",
}) => {
  const [isMobile] = useState(false);
  return (
    <Button onClick={onClick}>
      {iconSrc && <FilterIcon src={iconSrc} alt={iconAlt} />}
      {!isMobile && label}
    </Button>
  );
};

export default FilterButton;
