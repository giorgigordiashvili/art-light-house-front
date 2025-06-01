import styled from "styled-components";

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #1c2526;
  color: #ffffff;
  border: none;
  border-radius: 17px;
  padding: 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 138px;
  height: 52px;

  &:hover {
    border: 1px solid #ffc743;
  }

  @media (max-width: 1080px) {
    width: 52px;
    height: 52px;
    padding: 0;
    border-radius: 12px;
  }
`;

const SortIcon = styled.img`
  width: 20px;
  height: 20px;

  @media (max-width: 1080px) {
    width: 18px;
    height: 18px;
  }
`;

const Label = styled.span`
  @media (max-width: 1080px) {
    display: none;
  }
`;

interface SortButtonProps {
  onClick?: () => void;
  iconSrc?: string;
  dictionary: any;
  iconAlt?: string;
}

const SortButton: React.FC<SortButtonProps> = ({
  dictionary,
  onClick,
  iconSrc = "/assets/icons/Sort Icon.svg",
  iconAlt = "sort icon",
}) => {
  return (
    <Button onClick={onClick}>
      {iconSrc && <SortIcon src={iconSrc} alt={iconAlt} />}
      <Label>{dictionary.sort}</Label>
    </Button>
  );
};

export default SortButton;
