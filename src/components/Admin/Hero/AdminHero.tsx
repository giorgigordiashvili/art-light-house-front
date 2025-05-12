"use client";
import styled from "styled-components";
import Image from "next/image";

const HeroContainer = styled.div`
  background-color: #f8f9fb;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1.5rem;
  }
`;

const HeroContent = styled.div`
  flex: 1;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2b3445;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  color: #7d879c;
  margin-bottom: 1.5rem;
  max-width: 600px;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const StatItem = styled.div`
  background-color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  min-width: 140px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const StatValue = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2b3445;
  margin-bottom: 0.3rem;
`;

const StatLabel = styled.p`
  font-size: 0.9rem;
  color: #7d879c;
`;

const HeroImageWrapper = styled.div`
  flex: 0 0 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    margin-top: 2rem;
    flex: 0 0 200px;
  }
`;

interface AdminHeroProps {
  username?: string;
  productCount?: number;
  orderCount?: number;
  customerCount?: number;
}

const AdminHero = ({
  username = "Admin",
  productCount = 0,
  orderCount = 0,
  customerCount = 0,
}: AdminHeroProps) => {
  return (
    <HeroContainer>
      <HeroContent>
        <HeroTitle>Welcome, {username}</HeroTitle>
        <HeroSubtitle>
          Manage your products, orders, and customers from this dashboard. View real-time stats and
          make informed decisions.
        </HeroSubtitle>

        <StatsContainer>
          <StatItem>
            <StatValue>{productCount}</StatValue>
            <StatLabel>Total Products</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{orderCount}</StatValue>
            <StatLabel>Total Orders</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{customerCount}</StatValue>
            <StatLabel>Customers</StatLabel>
          </StatItem>
        </StatsContainer>
      </HeroContent>

      <HeroImageWrapper>
        <Image
          src="/assets/PillarLight.png"
          alt="Admin Dashboard"
          width={200}
          height={200}
          style={{ objectFit: "contain" }}
        />
      </HeroImageWrapper>
    </HeroContainer>
  );
};

export default AdminHero;
