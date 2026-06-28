import axios from 'axios';
import { AiActionRequest, AiActionResponse } from '../actions';

export const aiActionsService = {
  executeAction: async (request: AiActionRequest): Promise<AiActionResponse> => {
    try {
      // Use standard axios call to the hypothetical skills endpoint
      const response = await axios.post('/api/ai/skills/execute', request);
      return response.data;
    } catch (error) {
      console.error('AI Action Failed', error);
      throw new Error('Failed to execute AI action');
    }
  },
  
  streamAction: async function* (request: AiActionRequest): AsyncGenerator<string, void, unknown> {
    // For simplicity, mock streaming or handle via basic fetch since axios doesn't natively do text streaming easily
    const response = await fetch('/api/ai/skills/stream', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.body) throw new Error('No body');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value);
    }
  }
};
