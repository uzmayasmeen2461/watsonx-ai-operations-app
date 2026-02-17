import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filters: {},
    aiOriginalQuery: "",
    aiInterpretedText: "",
};

const filtersSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = action.payload;
        },
        clearFilterKey: (state, action) => {
            delete state.filters[action.payload];
        },
        setAIText: (state, action) => {
            state.aiInterpretedText = action.payload;
        },
        clearAllFilters: (state) => {
            state.filters = {};
            state.aiInterpretedText = "";
        },
        setAIOriginalQuery: (state, action) => {
            state.aiOriginalQuery = action.payload;
        },
    },
});

export const {
    setFilters,
    clearFilterKey,
    setAIText,
    clearAllFilters,
    setAIOriginalQuery,
} = filtersSlice.actions;

export default filtersSlice.reducer;
