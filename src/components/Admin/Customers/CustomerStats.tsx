"use client";

import React from "react";
import styled from "styled-components";

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatIcon = styled.div<{ background: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => props.background};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
`;

const LoadingStat = styled.div`
  height: 24px;
  background: #e9ecef;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
`;

interface CustomerStatsProps {
  totalCustomers: number;
  loading: boolean;
}

const CustomerStats: React.FC<CustomerStatsProps> = ({ totalCustomers, loading }) => {
  return (
    <StatsContainer>
      <StatCard>
        <StatIcon background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">👥</StatIcon>
        <StatContent>
          <StatLabel>Total Customers</StatLabel>
          {loading ? <LoadingStat /> : <StatValue>{totalCustomers.toLocaleString()}</StatValue>}
        </StatContent>
      </StatCard>

      <StatCard>
        <StatIcon background="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">📈</StatIcon>
        <StatContent>
          <StatLabel>New This Month</StatLabel>
          {loading ? <LoadingStat /> : <StatValue>—</StatValue>}
        </StatContent>
      </StatCard>

      <StatCard>
        <StatIcon background="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">⭐</StatIcon>
        <StatContent>
          <StatLabel>Active Customers</StatLabel>
          {loading ? <LoadingStat /> : <StatValue>—</StatValue>}
        </StatContent>
      </StatCard>

      <StatCard>
        <StatIcon background="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">💰</StatIcon>
        <StatContent>
          <StatLabel>Customer Growth</StatLabel>
          {loading ? <LoadingStat /> : <StatValue>+0%</StatValue>}
        </StatContent>
      </StatCard>
    </StatsContainer>
  );
};

export default CustomerStats;
