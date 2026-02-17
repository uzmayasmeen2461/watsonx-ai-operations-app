import { Chip, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearFilterKey,setAIText } from "../features/operations/filtersSlice";


const AIFilterChips = () => {
    const dispatch = useDispatch();
    const { filters, aiInterpretedText } = useSelector(
        (state) => state.filters
      );
    
    // Only show meaningful filters
    const activeFilters = Object.entries(filters).filter(
        ([_, value]) => value !== null && value !== ""
      );

    if (!activeFilters.length) return null;

    const generateQueryFromFilters = (filters) => {
        let parts = [];
      
        if (filters.processingState) {
          parts.push(filters.processingState.toLowerCase());
        }
      
        if (filters.priority) {
          parts.push(filters.priority.toLowerCase());
        }
      
        if (filters.operationId) {
          parts.push(`operation id ${filters.operationId}`);
        }
      
        if (parts.length === 0) return "";
      
        return `Show ${parts.join(" ")} operations`;
      };

    const updateAITextAfterFilterChange = (removedKey) => {
        const updatedFilters = { ...filters };
        delete updatedFilters[removedKey];
      
        const newText = generateQueryFromFilters(updatedFilters);
        dispatch(setAIText(newText));
      };
      

    const handleDelete = (key) => {
        dispatch(clearFilterKey(key));
        updateAITextAfterFilterChange(key);
      };



    return (
        <>
        {aiInterpretedText && (
          <Typography variant="caption" color="text.secondary">
            AI interpreted: "{aiInterpretedText}"
          </Typography>
        )}
  
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {activeFilters.map(([key, value]) => (
            <Chip
              key={key}
              label={`${key}: ${value}`}
              onDelete={() => handleDelete(key)}
              variant="outlined"
  color="primary"
  sx={{
    borderRadius: 2,
    fontWeight: 500
  }}
            />
          ))}
        </Stack>
      </>
    );
};

export default AIFilterChips;
