import { TextField, Button, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setAIText } from '../features/operations/filtersSlice';

const AISearchBar = ({ onAISearch, loading }) => {
    const dispatch = useDispatch();

    const { aiInterpretedText } = useSelector(
        (state) => state.filters
    );

    return (
        <Stack direction="row" spacing={2} mb={3}>
            <TextField
                fullWidth
                label="AI Search"
                value={aiInterpretedText}
                onChange={(e) => dispatch(setAIText(e.target.value))}
            />

            <Button
                variant="contained"
                onClick={() => onAISearch(aiInterpretedText)}
                disabled={!aiInterpretedText || loading}
            >
                AI Search
            </Button>
        </Stack>
    );
};

export default AISearchBar;
