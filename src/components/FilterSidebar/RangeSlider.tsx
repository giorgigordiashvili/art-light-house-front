import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

const minDistance = 10;

function valuetext(value: number) {
  return `${value}$`;
}

const CustomSlider = styled(Slider)(() => ({
  color: "#FFCB40",
  "& .MuiSlider-thumb": {
    backgroundColor: "#FFCB40",
    border: "4px solid #FFFFFF",
    width: 24,
    height: 24,
    borderRadius: "50%",
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "inherit",
    },
  },
  "& .MuiSlider-rail": {
    backgroundColor: "#FFCB40",
  },
  "& .MuiSlider-track": {
    backgroundColor: "#FFCB40",
  },
}));

const LineWrapper = styled(Box)`
  width: 100%;
`;

const LabelsWrapper = styled(Box)`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
`;

const LabelBox = styled(Box)`
  background-color: #111;
  color: #ccc;
  padding: 12px 24px;
  border-radius: 16px;
  font-size: 18px;
  font-family: inherit;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 80px;
  text-align: center;
`;

interface RangeSliderProps {
  minLabel: string;
  maxLabel: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ minLabel, maxLabel }) => {
  const [value, setValue] = React.useState<number[]>([20, 37]);

  const handleChange = (event: Event, newValue: number | number[], activeThumb: number) => {
    if (Array.isArray(newValue)) {
      if (newValue[1] - newValue[0] < minDistance) {
        if (activeThumb === 0) {
          const clamped = Math.min(newValue[0], 100 - minDistance);
          setValue([clamped, clamped + minDistance]);
        } else {
          const clamped = Math.max(newValue[1], minDistance);
          setValue([clamped - minDistance, clamped]);
        }
      } else {
        setValue(newValue);
      }
    }
  };

  return (
    <LineWrapper>
      <Box>
        <LabelsWrapper>
          <LabelBox>
            {minLabel}: {value[0]}₾
          </LabelBox>
          <LabelBox>
            {maxLabel}: {value[1]}₾
          </LabelBox>
        </LabelsWrapper>
        <CustomSlider
          getAriaLabel={() => "Minimum distance"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          disableSwap
        />
      </Box>
    </LineWrapper>
  );
};

export default RangeSlider;
