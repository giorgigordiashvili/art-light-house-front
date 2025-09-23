import styled from "styled-components";

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #212529;
  }
`;

export const CardContent = styled.div`
  flex: 1;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;
