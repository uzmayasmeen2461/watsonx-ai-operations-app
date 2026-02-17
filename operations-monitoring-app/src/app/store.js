import { configureStore } from '@reduxjs/toolkit';
import operationsReducer from '../features/operations/operationsSlice';
import filtersReducer from "../features/operations/filtersSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    operations: operationsReducer,
  },
});
