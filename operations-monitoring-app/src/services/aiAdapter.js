import axios from 'axios';

const ALLOWED_FILTERS = [
  'processingState',
  'priority',
  'sourceSystem',
  'createdStart',
  'createdEnd',
];

/**
 * Parse natural language using IBM Consulting Advantage AI
 */
export const parseAIQuery = async (query) => {
  const res = await fetch('http://localhost:4000/ai/intent/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  return res.json();
};

