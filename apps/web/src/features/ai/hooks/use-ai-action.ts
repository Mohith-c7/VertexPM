import { useState } from 'react';
import { aiActionsService } from '../services/ai-actions.service';
import { AiActionRequest, AiActionResponse } from '../actions';

export const useAiAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiActionResponse | null>(null);

  const execute = async (request: AiActionRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      // Mocking network delay and response for dev mode
      await new Promise(resolve => setTimeout(resolve, 1500));
      const res = {
        result: `[AI generated content for ${request.action} based on: ${request.context}]`,
      };
      // In real scenario, uncomment:
      // const res = await aiActionsService.executeAction(request);
      
      setResult(res);
      return res;
    } catch (err: any) {
      setError(err.message || 'Error executing action');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, error, result, setResult };
};
