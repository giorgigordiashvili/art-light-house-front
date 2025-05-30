"use client";
import styled from "styled-components";
import Settings from "@/components/Settings/Settings";

const StyledComponent = styled.div`
  background: black;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SettingsScreen = ({ dictionary }: any) => {
  return (
    <StyledComponent>
      <Settings dictionary={dictionary.settings}></Settings>
    </StyledComponent>
  );
};

export default SettingsScreen;
