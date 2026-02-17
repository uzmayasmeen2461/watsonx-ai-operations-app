// src/hooks/useOperationsQuery.js
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchOperations } from '../features/operations/operationsApi';

export const useOperationsQuery = () => {
  const filters = useSelector((state) => state.operations);

  return useQuery({
    queryKey: ['operations', filters],
    queryFn: () => fetchOperations(filters),
    enabled: false, // manual trigger
  });
};
