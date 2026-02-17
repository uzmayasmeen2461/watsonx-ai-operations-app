// src/features/operations/OperationsPage.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearFilters } from "./operationsSlice";
import { setAIQuery } from "./operationsSlice";
import { parseAIQuery } from "../../services/aiAdapter";
import AISearchBar from "../../components/AISearchBar";
import OperationsSearch from "./OperationsSearch";
import OperationsGrid from "./OperationsGrid";
import { useOperationsQuery } from "../../hooks/useOperationsQuery";
import AIFilterChips from "../../components/AIFilterChips";
import { Typography, Alert } from "@mui/material";
import {
  setFilters,
  setAIText,
  setAIOriginalQuery,
  clearAllFilters,
} from "./filtersSlice";
import {Container, Box, Paper } from "@mui/material";

const OperationsPage = () => {
  const dispatch = useDispatch();
  const { data = [], refetch, isFetching } = useOperationsQuery();
  const [aiLoading, setAiLoading] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState("");

  const { filters } = useSelector((state) => state.filters);

  let filteredRows = data;

  if (filters.processingState) {
    filteredRows = filteredRows.filter(
      (row) => row.processingState === filters.processingState
    );
  }

  if (filters.priority) {
    filteredRows = filteredRows.filter(
      (row) => row.priority === filters.priority
    );
  }

  if (filters.operationId) {
    filteredRows = filteredRows.filter(
      (row) =>
        row.operationId.toUpperCase() === filters.operationId.toUpperCase()
    );
  }

  if (filters.createdDate) {
    filteredRows = filteredRows.filter(
      (row) => row.createdDate === filters.createdDate
    );
  }

  const handleClear = () => {
    dispatch(clearAllFilters());
  };

  const handleAISearch = async (query) => {
    setAiLoading(true);

    try {
      const aiFilters = await parseAIQuery(query);
      if (Object.keys(aiFilters).length === 0) {
        setFallbackMessage("AI could not interpret your request.");
        return;
      }
      dispatch(setAIOriginalQuery(query));
      dispatch(setAIText(query));
      dispatch(setFilters(aiFilters));
    } catch (err) {
      setFallbackMessage("AI service unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        {fallbackMessage && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {fallbackMessage}
          </Alert>
        )}
        <Box sx={{ mb: 3 }}>
          <AISearchBar onAISearch={handleAISearch} loading={isFetching} />
          <AIFilterChips />
        </Box>
        <OperationsSearch onSearch={refetch} onClear={handleClear} />
        <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
          <OperationsGrid rows={filteredRows} />
        </Paper>
        {aiLoading && (
          <Typography>Watsonx AI is interpreting your request...</Typography>
        )}
      </Box>
    </Container>
  );
};

export default OperationsPage;
