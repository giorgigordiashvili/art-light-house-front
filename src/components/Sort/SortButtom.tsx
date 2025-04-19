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
    background-color: #2a3435;
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
  label?: string;
  onClick?: () => void;
  iconSrc?: string;
  iconAlt?: string;
}

const SortButton: React.FC<SortButtonProps> = ({
  label = "სორტირება",
  onClick,
  iconSrc = "/assets/icons/Sort Icon.svg",
  iconAlt = "icon",
}) => {
  return (
    <Button onClick={onClick}>
      {iconSrc && <SortIcon src={iconSrc} alt={iconAlt} />}
      <Label>{label}</Label>
    </Button>
  );
};

export default SortButton;
