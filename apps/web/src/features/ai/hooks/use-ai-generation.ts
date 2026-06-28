import { useState } from 'react';

export const useAiGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<any[]>([]);

  const generate = async (context: string) => {
    setIsGenerating(true);
    // Mock generate
    await new Promise(res => setTimeout(res, 2000));
    setGeneratedItems([
      { id: 1, title: 'Implement AI action menu', description: 'Create dropdown for AI actions.' },
      { id: 2, title: 'Add AI preview dialog', description: 'Show diff for AI generated text.' }
    ]);
    setIsGenerating(false);
  };

  const clear = () => setGeneratedItems([]);

  return { isGenerating, generatedItems, generate, clear };
};
