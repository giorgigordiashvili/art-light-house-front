import styled from "styled-components";

const Button = styled.button`
  display: none;
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
  z-index: 1000;

  &:hover {
    background-color: #2a3435;
  }

  @media (max-width: 1080px) {
    display: flex;
  }
`;

const FilterIcon = styled.img`
  width: 20px;
  height: 20px;
`;

interface FilterButtonProps {
  onClick?: () => void;
  iconSrc?: string;
  dictionary: any;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  iconSrc = "/assets/icons/filter.svg",
  dictionary,
}) => {
  return (
    <Button onClick={onClick}>
      {iconSrc && <FilterIcon src={iconSrc} alt={dictionary.filter.iconAlt || "Filter icon"} />}
      <span>{dictionary.filter.title}</span>
    </Button>
  );
};

export default FilterButton;
