import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Box } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSettingsContext } from "@/context/SettingsContext";

export default function CalendarButton() {
  const { dates, setDates } = useSettingsContext();

  const handleStartDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      if (dates.endDate && newValue.isAfter(dates.endDate)) {
        throw new Error("Start date cannot be after end date");
      } else {
        setDates((prevDates) => ({ ...prevDates, startDate: newValue }));
      }
    } else {
      throw new Error("Date cannot be null");
    }
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      if (dates.startDate && newValue.isBefore(dates.startDate)) {
        throw new Error("End date cannot be before start date");
      } else {
        setDates((prevDates) => ({ ...prevDates, endDate: newValue }));
      }
    } else {
      throw new Error("Date cannot be null");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          marginTop: "80px",
          marginLeft: "10px",
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <DatePicker
          label="Display Start Date"
          value={dates.startDate}
          minDate={dayjs("2019-01-01")}
          maxDate={dayjs("2023-12-31")}
          onChange={handleStartDateChange}
        />
        <DatePicker
          label="Display End Date"
          value={dates.endDate}
          minDate={dayjs("2019-01-01")}
          maxDate={dayjs("2023-12-31")}
          onChange={handleEndDateChange}
        />
      </Box>
    </LocalizationProvider>
  );
}
