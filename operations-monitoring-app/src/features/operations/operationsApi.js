// src/features/operations/operationsApi.js
import axios from 'axios';

export const fetchOperations = async (filters) => {
  const response = await axios.get('https://dummyjson.com/products');
  let data = response.data.products;

  // 🔍 Apply filters (client-side for dummy API)
  if (filters.operationId) {
    data = data.filter((item) =>
      `OP-${item.id}`.includes(filters.operationId)
    );
  }

  if (filters.processingState) {
    data = data.filter((item) =>
      filters.processingState === 'COMPLETED'
        ? item.stock > 50
        : item.stock <= 50
    );
  }

  if (filters.priority) {
    data = data.filter((item) =>
      filters.priority === 'HIGH'
        ? item.rating > 4
        : item.rating <= 4
    );
  }

  return data.map((item) => ({
    id: item.id,
    operationId: `OP-${item.id}`,
    processingState: item.stock > 50 ? 'COMPLETED' : 'FAILED',
    priority: item.rating > 4 ? 'HIGH' : 'MEDIUM',
    sourceSystem: item.brand,
    createdDate: new Date().toISOString().slice(0, 10),
  }));
};
