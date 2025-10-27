"use client";
import React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import styled from "styled-components";
import { useFilterContext } from "@/contexts/FilterContext";

const SliderWrapper = styled.div`
  width: 100%;
  padding: 10px 5px;
  margin-top: 10px;

  .MuiSlider-root {
    color: #ffcb40;
  }

  .MuiSlider-thumb {
    width: 16px;
    height: 16px;
    background-color: #ffcb40;
    border: 2px solid #fff;

    &:hover,
    &.Mui-focusVisible {
      box-shadow: 0 0 0 8px rgba(255, 203, 64, 0.16);
    }

    &.Mui-active {
      box-shadow: 0 0 0 14px rgba(255, 203, 64, 0.16);
    }
  }

  .MuiSlider-track {
    background-color: #ffcb40;
    border: none;
  }

  .MuiSlider-rail {
    background-color: #3f3e3d;
    opacity: 1;
  }

  .MuiSlider-valueLabel {
    background-color: #ffcb40;
    color: #0b0b0b;
    font-weight: 600;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;

    &:before {
      border-top-color: #ffcb40;
    }
  }
`;

const minDistance = 10;

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
}

function valuetext(value: number) {
  return `₾${value}`;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ min = 0, max = 1000 }) => {
  const { filters, updatePriceFilter } = useFilterContext();
  const [value, setValue] = React.useState<number[]>([
    filters.minPrice || min,
    filters.maxPrice || max,
  ]);

  React.useEffect(() => {
    setValue([filters.minPrice || min, filters.maxPrice || max]);
  }, [filters.minPrice, filters.maxPrice, min, max]);

  const handleChange = (event: Event, newValue: number | number[], activeThumb: number) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      const newMin = Math.min(newValue[0], value[1] - minDistance);
      setValue([newMin, value[1]]);
    } else {
      const newMax = Math.max(newValue[1], value[0] + minDistance);
      setValue([value[0], newMax]);
    }
  };

  const handleChangeCommitted = (
    event: Event | React.SyntheticEvent,
    newValue: number | number[]
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    updatePriceFilter(newValue[0], newValue[1]);
  };

  return (
    <SliderWrapper>
      <Box sx={{ width: "100%" }}>
        <Slider
          getAriaLabel={() => "Price range"}
          value={value}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          valueLabelFormat={valuetext}
          disableSwap
          min={min}
          max={max}
        />
      </Box>
    </SliderWrapper>
  );
};

export default PriceRangeSlider;
