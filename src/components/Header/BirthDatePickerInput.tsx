import React, { useMemo, useRef, useState } from "react";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";

import ModalInput from "./ModalInput";

type Props = {
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const BirthDatePickerInput: React.FC<Props> = ({ value, placeholder, onChange, disabled }) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [draftValue, setDraftValue] = useState<Dayjs | null>(null);

  const parsedValue: Dayjs | null = useMemo(() => {
    if (!value) return null;
    const parsed = dayjs(value, "YYYY-MM-DD", true);
    return parsed.isValid() ? parsed : null;
  }, [value]);

  const close = () => setOpen(false);
  const toggleOpen = () => {
    if (disabled) return;
    setDraftValue(parsedValue);
    setOpen(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div ref={anchorRef}>
        <ModalInput
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={() => {
            // Keep the value controlled by calendar selection.
          }}
          isDateField
          readOnly
          onClick={toggleOpen}
          onIconClick={toggleOpen}
          fullWidth
        />
      </div>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="top-start"
        disablePortal
        popperOptions={{ strategy: "fixed" }}
        modifiers={[
          { name: "offset", options: { offset: [0, 8] } },
          // Keep it anchored above; don't flip to bottom.
          { name: "flip", enabled: false },
          // Avoid repositioning jumps when calendar height changes (year/month/day views).
          { name: "preventOverflow", options: { padding: 8, altAxis: true, tether: false } },
        ]}
        style={{ zIndex: 1103 }}
      >
        <ClickAwayListener onClickAway={close}>
          <Paper
            elevation={8}
            onMouseDown={(e) => {
              // Prevent parent overlays (outside-click) from receiving this event.
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            sx={{
              bgcolor: "#1c1c1c",
              color: "#fafafa",
              borderRadius: "12px",
              border: "1px solid #ffffff12",
              p: 1,
            }}
          >
            <DateCalendar
              value={draftValue}
              views={["year", "month", "day"]}
              onChange={(newValue, selectionState) => {
                setDraftValue(newValue);

                // Only commit + close when a specific day is chosen.
                // When switching year/month, MUI sends a 'partial' selection state.
                const state = selectionState as unknown as "partial" | "finish" | undefined;
                if (state !== "finish") return;
                if (!newValue) return;

                onChange(newValue.format("YYYY-MM-DD"));
                close();
              }}
              disableFuture
              maxDate={dayjs()}
              sx={{
                "& .MuiPickersCalendarHeader-label": { color: "#fafafa" },
                "& .MuiPickersArrowSwitcher-button": { color: "#fafafa" },
                "& .MuiDayCalendar-weekDayLabel": { color: "#919191" },
                "& .MuiPickersDay-root": { color: "#fafafa" },
                "& .MuiPickersDay-root.Mui-selected": { backgroundColor: "#2a2a2a" },
                "& .MuiPickersDay-root.Mui-selected:hover": { backgroundColor: "#3a3a3a" },
                "& .MuiPickersDay-root:hover": { backgroundColor: "#2a2a2a" },
              }}
            />
          </Paper>
        </ClickAwayListener>
      </Popper>
    </LocalizationProvider>
  );
};

export default BirthDatePickerInput;
