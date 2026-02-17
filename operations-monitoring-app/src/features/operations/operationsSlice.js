// src/features/operations/operationsSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  operationId: '',
  processingState: '',
  priority: '',
  sourceSystem: '',
  createdStart: null,
  createdEnd: null,
  aiQuery: ''
};

const operationsSlice = createSlice({
  name: 'operations',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearFilters: () => initialState,
    setAIQuery: (state, action) => {
      state.aiQuery = action.payload;
    },
  },
});

export const { setFilters, clearFilters,setAIQuery } = operationsSlice.actions;
export default operationsSlice.reducer;
