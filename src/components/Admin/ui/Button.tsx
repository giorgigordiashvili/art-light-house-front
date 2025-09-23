import styled, { css } from "styled-components";

interface ButtonProps {
  $variant?: "primary" | "secondary" | "danger" | "success";
  $size?: "sm" | "md" | "lg";
  $fullWidth?: boolean;
}

const getButtonStyles = ({ $variant = "primary" }: ButtonProps) => {
  const variants = {
    primary: css`
      background: #007bff;
      color: white;
      border: 1px solid #007bff;

      &:hover:not(:disabled) {
        background: #0056b3;
        border-color: #0056b3;
      }
    `,
    secondary: css`
      background: white;
      color: #6c757d;
      border: 1px solid #dee2e6;

      &:hover:not(:disabled) {
        background: #f8f9fa;
        border-color: #adb5bd;
      }
    `,
    danger: css`
      background: #dc3545;
      color: white;
      border: 1px solid #dc3545;

      &:hover:not(:disabled) {
        background: #c82333;
        border-color: #bd2130;
      }
    `,
    success: css`
      background: #28a745;
      color: white;
      border: 1px solid #28a745;

      &:hover:not(:disabled) {
        background: #218838;
        border-color: #1e7e34;
      }
    `,
  };

  return variants[$variant];
};

const getSizeStyles = ({ $size = "md" }: ButtonProps) => {
  const sizes = {
    sm: css`
      padding: 6px 12px;
      font-size: 0.875rem;
    `,
    md: css`
      padding: 8px 16px;
      font-size: 1rem;
    `,
    lg: css`
      padding: 12px 24px;
      font-size: 1.125rem;
    `,
  };

  return sizes[$size];
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  outline: none;
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  ${getButtonStyles}
  ${getSizeStyles}

  svg {
    margin-right: 8px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
