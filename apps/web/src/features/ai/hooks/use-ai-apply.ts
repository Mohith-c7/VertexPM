import { useState } from 'react';

export const useAiApply = (onApplyCallback: (data: any) => void) => {
  const [isApplying, setIsApplying] = useState(false);

  const apply = async (data: any) => {
    setIsApplying(true);
    try {
      // Simulate apply
      await new Promise(res => setTimeout(res, 500));
      onApplyCallback(data);
    } finally {
      setIsApplying(false);
    }
  };

  return { apply, isApplying };
};
