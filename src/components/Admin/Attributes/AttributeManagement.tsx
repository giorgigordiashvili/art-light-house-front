"use client";
import React, { useState } from "react";
import styled from "styled-components";
import AttributeTypeManagerMultilingual from "./AttributeTypeManagerMultilingual";
import AttributeValueManagerMultilingual from "./AttributeValueManagerMultilingual";

const Container = styled.div`
  padding: 0;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #2b3445;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: #7d879c;
  margin: 0;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e5e5;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  color: ${(props) => (props.$isActive ? "#2b3445" : "#7d879c")};
  border-bottom: 2px solid ${(props) => (props.$isActive ? "#2b3445" : "transparent")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #2b3445;
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const AttributeManagement = () => {
  const [activeTab, setActiveTab] = useState<"types" | "values">("types");
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => {
    // Trigger refresh in child components by updating key
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Container>
      <Header>
        <Title>Attribute Management</Title>
        <Subtitle>
          Manage product attributes and their values. Define attribute types (like Color, Size) and
          their possible values (like Red, Blue, Large, Small) with multilingual support.
        </Subtitle>
      </Header>

      <TabContainer>
        <Tab $isActive={activeTab === "types"} onClick={() => setActiveTab("types")}>
          Attribute Types
        </Tab>
        <Tab $isActive={activeTab === "values"} onClick={() => setActiveTab("values")}>
          Attribute Values
        </Tab>
      </TabContainer>

      <ContentArea>
        {activeTab === "types" ? (
          <AttributeTypeManagerMultilingual key={`types-${refreshKey}`} onRefresh={refreshData} />
        ) : (
          <AttributeValueManagerMultilingual key={`values-${refreshKey}`} onRefresh={refreshData} />
        )}
      </ContentArea>
    </Container>
  );
};

export default AttributeManagement;
