import styled from "styled-components";

const Container = styled.textarea`
  width: 364px;
  height: 129px;
  border-radius: 10px;
  border: 1px solid #ffffff12;
  background: #2a2a2a96;
  padding: 16px;
  color: white;
  font-size: 14px;
  resize: none;

  @media (max-width: 1080px) {
    width: 100%;
    height: 129px;
  }

  &::placeholder {
    color: #999;
  }
`;

interface Props {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextContainer = ({ placeholder, value, onChange }: Props) => {
  return <Container placeholder={placeholder} value={value} onChange={onChange} />;
};

export default TextContainer;
