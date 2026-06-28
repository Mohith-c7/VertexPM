import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AiApplyButton = ({ onClick, disabled }: { onClick: () => void, disabled?: boolean }) => (
  <Button 
    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2 shadow-md shadow-purple-500/20" 
    onClick={onClick}
    disabled={disabled}
  >
    <Check size={16} />
    <span>Apply Changes</span>
  </Button>
);
