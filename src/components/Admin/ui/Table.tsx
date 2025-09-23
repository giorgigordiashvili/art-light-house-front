import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

export const TableHeader = styled.thead`
  background: #f8f9fa;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  &:hover {
    background: #f8f9fa;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #dee2e6;
  }
`;

export const TableHead = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TableCell = styled.td`
  padding: 12px 16px;
  color: #212529;
  vertical-align: middle;
`;

export const TableActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6c757d;

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  h3 {
    margin: 0 0 8px 0;
    font-size: 1.125rem;
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;

  &::after {
    content: "";
    width: 32px;
    height: 32px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
