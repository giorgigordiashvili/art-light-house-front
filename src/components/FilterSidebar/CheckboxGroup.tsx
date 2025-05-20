"use client";
import React from "react";
import styled from "styled-components";
import { CheckboxOption } from "./types";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  title: string;
  options: CheckboxOption[];
  onChange: (value: string) => void;
}

const GroupWrapper = styled.div`
  position: relative;
`;

const Title = styled.p`
  color: white;
  font-family: Helvetica;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0%;
  vertical-align: middle;
  margin-bottom: 18px;
`;

const OptionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionItem = styled.li`
  label {
    display: flex;
    align-items: center;
    gap: 13px;
    font-family: Helvetica;
    font-weight: 300;
    font-size: 16px;
    line-height: 24px;
    height: 24px;
    letter-spacing: 0%;
    color: white;
    cursor: pointer;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    input[type="checkbox"] {
      accent-color: #ffc700;
      width: 16px;
      height: 16px;
      cursor: pointer;
      flex-shrink: 0;
    }
  }
`;

function CheckboxGroup({ title, options, onChange }: Props) {
  return (
    <>
      <GroupWrapper>
        <Title>{title}</Title>
        <OptionList>
          {options.map((opt) => (
            <OptionItem key={opt.value}>
              <label>
                <input type="checkbox" checked={opt.checked} onChange={() => onChange(opt.value)} />
                {opt.label}
              </label>
            </OptionItem>
          ))}
        </OptionList>
      </GroupWrapper>
    </>
  );
}

export default CheckboxGroup;
