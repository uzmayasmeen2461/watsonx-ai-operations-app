// src/features/operations/OperationsSearch.jsx
import { Stack, TextField, Button, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  clearAllFilters,
  setAIText,
} from "../operations/filtersSlice";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const OperationsSearch = ({ onSearch }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.filters);

  const handleChange = (key, value) => {
    dispatch(
      setFilters({
        ...filters,
        [key]: value,
      })
    );
  };

  const handleClear = () => {
    dispatch(clearAllFilters());
  };

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3, mt: 2 }}>
      {/* Operation ID */}
      <TextField
        label="Operation ID"
        value={filters.operationId || ""}
        onChange={(e) => handleChange("operationId", e.target.value)}
        sx={{ minWidth: 180 }}
      />

      {/* Processing State (Wider Now) */}
      <TextField
        select
        label="Processing State"
        value={filters.processingState || ""}
        onChange={(e) => handleChange("processingState", e.target.value)}
        sx={{ minWidth: 200 }} // 👈 Increased width
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="COMPLETED">COMPLETED</MenuItem>
        <MenuItem value="FAILED">FAILED</MenuItem>
        <MenuItem value="PENDING">PENDING</MenuItem>
      </TextField>

      {/* Priority Dropdown */}
      <TextField
        select
        label="Priority"
        value={filters.priority || ""}
        onChange={(e) => handleChange("priority", e.target.value)}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="HIGH">HIGH</MenuItem>
        <MenuItem value="LOW">LOW</MenuItem>
      </TextField>

      {/* Created Date */}
      <DatePicker
        label="Created Date"
        value={filters.createdDate ? dayjs(filters.createdDate) : null}
        onChange={(newValue) => {
          dispatch(
            setFilters({
              ...filters,
              createdDate: newValue ? newValue.format("YYYY-MM-DD") : "",
            })
          );
        }}
        sx={{ minWidth: 200 }}
      />

      {/* Buttons */}
      <Button variant="contained" onClick={onSearch}>
        Search
      </Button>

      <Button variant="outlined" onClick={handleClear}>
        Clear
      </Button>
    </Stack>
  );
};

export default OperationsSearch;
