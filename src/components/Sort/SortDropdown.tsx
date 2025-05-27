"use client";
import { useState } from "react";
import styled from "styled-components";
import SortButton from "./SortButtom";
import SortBox from "./SortBox";

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownWrapper = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  z-index: 10;
`;

interface SortDropdownProps {
  dictionary: any;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ dictionary }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSortChange = (option: string) => {
    setIsOpen(false);
    console.log("Sort selected:", option);
  };

  return (
    <Wrapper>
      <SortButton onClick={toggleDropdown} dictionary={dictionary} />
      {isOpen && (
        <DropdownWrapper>
          <SortBox onSortChange={handleSortChange} dictionary={dictionary} />
        </DropdownWrapper>
      )}
    </Wrapper>
  );
};

export default SortDropdown;
